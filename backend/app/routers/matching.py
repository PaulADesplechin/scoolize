from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Program, Student
from app.schemas import MatchResult, ProgramOut

router = APIRouter(prefix="/api/match", tags=["matching"])


@router.get("/{student_id}", response_model=list[MatchResult])
def match_student(student_id: int, limit: int = 10, db: Session = Depends(get_db)):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")

    from matching import compute_match_score  # import paresseux

    results: list[MatchResult] = []
    for program in db.query(Program).all():
        score = compute_match_score(student, program)
        results.append(
            MatchResult(program=ProgramOut.model_validate(program), **score)
        )
    results.sort(key=lambda r: r.score, reverse=True)
    return results[:limit]
