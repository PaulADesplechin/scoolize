from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import get_or_404
from app.models import Application, Student
from app.schemas import (
    CandidateDetailOut,
    CandidateOut,
    GradeOut,
    GradeTrimester,
    ProgramOut,
    StatusUpdate,
    SubjectGap,
)

router = APIRouter(prefix="/api", tags=["prepare"])


@router.get("/candidates", response_model=list[CandidateOut])
def list_candidates(
    program_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Vue côté école : candidats ayant postulé (optionnellement filtrés par formation)."""
    query = (
        db.query(Application)
        .options(
            joinedload(Application.student).joinedload(Student.school),
            joinedload(Application.program),
        )
        .order_by(Application.score_snapshot.desc().nullslast())
    )
    if program_id:
        query = query.filter(Application.program_id == program_id)

    return [
        CandidateOut(
            application_id=app_row.id,
            student_name=f"{app_row.student.first_name} {app_row.student.last_name}",
            student_school=app_row.student.school.name if app_row.student.school else None,
            student_track=app_row.student.track,
            program_id=app_row.program.id,
            program_name=app_row.program.name,
            program_type=app_row.program.type,
            score=app_row.score_snapshot,
            status=app_row.status,
        )
        for app_row in query.all()
    ]


def _synthesise_evolution(grades_by_subject: dict[str, float]) -> list[GradeTrimester]:
    """Génère T1/T2/T3 depuis la note actuelle pour le graphique d'évolution.

    Le modèle ne stocke qu'une période par note ; ce qui suit est une projection
    démo (T3 = actuel, T2 ≈ -0,5, T1 ≈ -1,0), bornée à [0, 20].
    """
    return [
        GradeTrimester(
            subject=subject,
            t1=round(max(0.0, value - 1.0), 1),
            t2=round(max(0.0, value - 0.5), 1),
            t3=round(value, 1),
        )
        for subject, value in grades_by_subject.items()
    ]


def _build_comparison(
    grades_by_subject: dict[str, float],
    key_subjects: dict[str, float],
    program_minimum: float | None,
) -> list[SubjectGap]:
    return [
        SubjectGap(
            subject=subject,
            student_average=grades_by_subject.get(subject),
            program_minimum=program_minimum,
            weight=weight,
            meets_minimum=(
                grades_by_subject.get(subject) is not None
                and program_minimum is not None
                and grades_by_subject[subject] >= program_minimum
            )
            if program_minimum is not None
            else True,
        )
        for subject, weight in (key_subjects or {}).items()
    ]


@router.get("/candidates/{application_id}", response_model=CandidateDetailOut)
def get_candidate(application_id: int, db: Session = Depends(get_db)):
    """Vue détaillée d'une candidature : profil, notes, évolution, comparatif aux critères."""
    app_row = (
        db.query(Application)
        .options(
            joinedload(Application.student).joinedload(Student.school),
            joinedload(Application.student).joinedload(Student.grades),
            joinedload(Application.program),
        )
        .filter(Application.id == application_id)
        .first()
    )
    if app_row is None:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Candidature introuvable")

    student = app_row.student
    program = app_row.program
    grades_by_subject = {g.subject: g.value for g in student.grades}

    return CandidateDetailOut(
        application_id=app_row.id,
        status=app_row.status,
        score=app_row.score_snapshot,
        student_id=student.id,
        student_name=f"{student.first_name} {student.last_name}",
        student_school=student.school.name if student.school else None,
        student_track=student.track,
        program=ProgramOut.model_validate(program),
        grades=[GradeOut.model_validate(g) for g in student.grades],
        evolution=_synthesise_evolution(grades_by_subject),
        comparison=_build_comparison(
            grades_by_subject, program.key_subjects or {}, program.min_average
        ),
    )


@router.patch("/candidates/{application_id}", response_model=CandidateOut)
def update_candidate_status(
    application_id: int, payload: StatusUpdate, db: Session = Depends(get_db)
):
    """Met à jour le statut d'une candidature (accepté / en attente / refusé)."""
    app_row = (
        db.query(Application)
        .options(
            joinedload(Application.student).joinedload(Student.school),
            joinedload(Application.program),
        )
        .filter(Application.id == application_id)
        .first()
    )
    if app_row is None:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Candidature introuvable")

    app_row.status = payload.status
    db.commit()
    db.refresh(app_row)

    return CandidateOut(
        application_id=app_row.id,
        student_name=f"{app_row.student.first_name} {app_row.student.last_name}",
        student_school=app_row.student.school.name if app_row.student.school else None,
        student_track=app_row.student.track,
        program_id=app_row.program.id,
        program_name=app_row.program.name,
        program_type=app_row.program.type,
        score=app_row.score_snapshot,
        status=app_row.status,
    )
