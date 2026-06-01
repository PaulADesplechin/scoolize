from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_or_404, get_owned_student
from app.models import Grade, Student
from app.schemas import GradeIn, GradeOut, StudentCreate, StudentOut
from app.security import hash_password

router = APIRouter(prefix="/api/students", tags=["students"])


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
    return get_or_404(db, Student, student_id, "Étudiant")


@router.post("/{student_id}/grades", response_model=list[GradeOut])
def add_grades(
    grades: list[GradeIn],
    db: Session = Depends(get_db),
    student: Student = Depends(get_owned_student),
):
    created = [
        Grade(student_id=student.id, subject=g.subject, value=g.value, period=g.period)
        for g in grades
    ]
    db.add_all(created)
    db.commit()
    for grade in created:
        db.refresh(grade)
    return created


@router.post("/{student_id}/upload", dependencies=[Depends(get_owned_student)])
def upload_bulletin(file: UploadFile = File(...)):
    """Upload d'un bulletin PDF → extraction OCR des notes (non persistées : l'étudiant valide avant)."""
    from ocr import extract_grades_from_bytes  # import paresseux (dépendances lourdes)

    content = file.file.read()
    extracted = extract_grades_from_bytes(content, filename=file.filename)
    return {"filename": file.filename, "extracted": extracted}
