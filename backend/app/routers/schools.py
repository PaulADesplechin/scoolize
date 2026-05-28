from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import School
from app.schemas import SchoolOut

router = APIRouter(prefix="/api/schools", tags=["schools"])


@router.get("", response_model=list[SchoolOut])
def list_schools(db: Session = Depends(get_db)):
    return db.query(School).order_by(School.name).all()
