from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Application
from app.schemas import CandidateOut

router = APIRouter(prefix="/api", tags=["prepare"])


@router.get("/candidates", response_model=list[CandidateOut])
def list_candidates(
    program_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Vue côté école : candidats ayant postulé (optionnellement filtrés par formation)."""
    query = db.query(Application)
    if program_id:
        query = query.filter(Application.program_id == program_id)

    candidates = [
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
    candidates.sort(key=lambda c: (c.score or 0.0), reverse=True)
    return candidates
