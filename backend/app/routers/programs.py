from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Program
from app.schemas import ProgramCreate, ProgramOut, ProgramType

router = APIRouter(prefix="/api/programs", tags=["programs"])


@router.get("", response_model=list[ProgramOut])
def list_programs(
    type: ProgramType | None = Query(default=None),
    region: str | None = None,
    domain: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Program)
    if type:
        query = query.filter(Program.type == type)
    if region:
        query = query.filter(Program.region == region)
    if domain:
        query = query.filter(Program.domain == domain)
    if q:
        query = query.filter(Program.name.ilike(f"%{q}%"))
    return query.all()


@router.post("", response_model=ProgramOut, status_code=201)
def create_program(payload: ProgramCreate, db: Session = Depends(get_db)):
    # Portail Prepare ouvert pour la démo : l'auth établissement est une itération future.
    program = Program(**payload.model_dump())
    db.add(program)
    db.commit()
    db.refresh(program)
    return program
