from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_student, get_or_404
from app.models import Application, Program, Student
from app.schemas import ApplicationCreate, ApplicationOut

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post("", response_model=ApplicationOut, status_code=201)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    program = get_or_404(db, Program, payload.program_id, "Formation")

    existing = (
        db.query(Application)
        .filter(
            Application.student_id == current.id,
            Application.program_id == program.id,
        )
        .first()
    )
    if existing:
        return existing

    from matching import compute_match_score  # import paresseux

    score = compute_match_score(current, program)["score"]
    application = Application(
        student_id=current.id, program_id=program.id, score_snapshot=score
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/me", response_model=list[ApplicationOut])
def my_applications(
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    return (
        db.query(Application).filter(Application.student_id == current.id).all()
    )
