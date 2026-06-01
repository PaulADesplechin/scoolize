from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Application, Student
from app.schemas import CandidateOut

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
