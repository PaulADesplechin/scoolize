from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class School(Base):
    """Lycée d'origine de l'étudiant."""

    __tablename__ = "schools"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    uai_code = Column(String, unique=True, index=True)
    city = Column(String)
    region = Column(String)

    students = relationship("Student", back_populates="school")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    track = Column(String)  # filière / spécialités au bac
    school_id = Column(Integer, ForeignKey("schools.id"))
    created_at = Column(DateTime, default=_utcnow)

    school = relationship("School", back_populates="students")
    grades = relationship(
        "Grade", back_populates="student", cascade="all, delete-orphan"
    )
    applications = relationship(
        "Application", back_populates="student", cascade="all, delete-orphan"
    )


class Program(Base):
    """Formation post-bac déclarée côté Prepare."""

    __tablename__ = "programs"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    institution = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "selective" | "non_selective"
    domain = Column(String)
    city = Column(String)
    region = Column(String)
    capacity = Column(Integer)
    admission_rate = Column(Float)  # taux d'admission historique (0..1)
    min_average = Column(Float)  # moyenne minimale indicative (/20)
    key_subjects = Column(JSON, default=dict)  # {matière: poids}
    created_at = Column(DateTime, default=_utcnow)

    applications = relationship(
        "Application", back_populates="program", cascade="all, delete-orphan"
    )


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject = Column(String, nullable=False)
    value = Column(Float, nullable=False)  # note /20
    period = Column(String)  # ex. "Trimestre 1"

    student = relationship("Student", back_populates="grades")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    status = Column(String, default="submitted")
    score_snapshot = Column(Float)
    created_at = Column(DateTime, default=_utcnow)

    student = relationship("Student", back_populates="applications")
    program = relationship("Program", back_populates="applications")
