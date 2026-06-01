from typing import Type, TypeVar

from fastapi import Depends, HTTPException, Path
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import Base, get_db
from app.models import Student
from app.security import decode_token

bearer = HTTPBearer(auto_error=True)

T = TypeVar("T", bound=Base)


def get_or_404(db: Session, model: Type[T], obj_id: int, label: str) -> T:
    """Charge une entité ou lève une 404 avec un libellé lisible."""
    obj = db.get(model, obj_id)
    if obj is None:
        raise HTTPException(status_code=404, detail=f"{label} introuvable")
    return obj


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


def get_owned_student(
    student_id: int = Path(..., description="id de l'étudiant propriétaire"),
    current: Student = Depends(get_current_student),
) -> Student:
    """Renvoie l'étudiant si {student_id} correspond bien à l'utilisateur authentifié."""
    if student_id != current.id:
        raise HTTPException(status_code=403, detail="Accès refusé")
    return current
