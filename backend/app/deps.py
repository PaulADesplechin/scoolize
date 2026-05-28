from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Student
from app.security import decode_token

bearer = HTTPBearer(auto_error=True)


def get_current_student(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> Student:
    sub = decode_token(creds.credentials)
    if sub is None:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
    student = db.get(Student, int(sub))
    if student is None:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return student
