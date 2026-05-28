from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_student
from app.models import Grade, Student
from app.schemas import GradeIn, GradeOut, StudentCreate, StudentOut
from app.security import hash_password

router = APIRouter(prefix="/api/students", tags=["students"])


def _ensure_owner(student_id: int, current: Student) -> None:
    if student_id != current.id:
        raise HTTPException(status_code=403, detail="Accès refusé")


@router.post("", response_model=StudentOut, status_code=201)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    if db.query(Student).filter(Student.email == payload.email).first():
        raise HTTPException(status_code=409, detail="Email déjà utilisé")
    student = Student(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        track=payload.track,
        school_id=payload.school_id,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")
    return student


@router.post("/{student_id}/grades", response_model=list[GradeOut])
def add_grades(
    student_id: int,
    grades: list[GradeIn],
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    _ensure_owner(student_id, current)
    created = [
        Grade(student_id=student_id, subject=g.subject, value=g.value, period=g.period)
        for g in grades
    ]
    db.add_all(created)
    db.commit()
    for grade in created:
        db.refresh(grade)
    return created


@router.post("/{student_id}/upload")
def upload_bulletin(
    student_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    """Upload d'un bulletin PDF → extraction OCR des notes (non persistées : l'étudiant valide avant)."""
    _ensure_owner(student_id, current)
    from ocr import extract_grades_from_bytes  # import paresseux (dépendances lourdes)

    content = file.file.read()
    extracted = extract_grades_from_bytes(content, filename=file.filename)
    return {"filename": file.filename, "extracted": extracted}
