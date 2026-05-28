from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Student
from app.schemas import LoginIn, Token
from app.security import create_access_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == payload.email).first()
    if not student or not verify_password(payload.password, student.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    return Token(access_token=create_access_token(str(student.id)))
