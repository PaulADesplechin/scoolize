"""Seed de la base Scoolize : lycées, formations et étudiants de démonstration.

Données illustratives inspirées des jeux open data publics (voir data/README.md).
Les fichiers source sont data/lycees.csv et data/formations.csv.

Usage :
    python scripts/seed.py
"""
from __future__ import annotations

import csv
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend"
DATA = ROOT / "data"

# La base de dev vit dans backend/scoolize.db (là où tourne uvicorn).
os.environ.setdefault("DATABASE_URL", f"sqlite:///{BACKEND / 'scoolize.db'}")
sys.path.insert(0, str(BACKEND))

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.models import Grade, Program, School, Student  # noqa: E402
from app.security import hash_password  # noqa: E402


def _float(value: str) -> float | None:
    value = value.strip()
    return float(value) if value else None


def _int(value: str) -> int | None:
    value = value.strip()
    return int(value) if value else None


def _subjects(value: str) -> dict[str, float]:
    result: dict[str, float] = {}
    for part in value.split(";"):
        part = part.strip()
        if not part:
            continue
        subject, _, weight = part.partition(":")
        result[subject.strip()] = float(weight)
    return result


DEMO_PASSWORD = "demo1234"

# (prénom, nom, email, filière, lycée, {matière: note}) — profils variés
STUDENTS = [
    ("Léa", "Martin", "lea.martin@demo.scoolize.fr",
     "Générale — spé Mathématiques, Physique-Chimie", "Lycée Louis-le-Grand",
     {"Mathématiques": 18.0, "Physique-Chimie": 17.0, "NSI": 16.5,
      "Français": 14.0, "Histoire-Géographie": 13.5, "LV1 Anglais": 15.0,
      "Philosophie": 15.0}),
    ("Camille", "Robert", "camille.robert@demo.scoolize.fr",
     "Générale — spé HLP, HGGSP", "Lycée Henri-IV",
     {"Français": 17.0, "Philosophie": 16.0, "Histoire-Géographie": 16.5,
      "LV1 Anglais": 15.0, "Mathématiques": 10.0, "SES": 13.0}),
    ("Noah", "Petit", "noah.petit@demo.scoolize.fr",
     "Générale — spé Mathématiques, SES", "Lycée du Parc",
     {"Mathématiques": 12.0, "SES": 12.5, "LV1 Anglais": 11.5,
      "Français": 11.0, "Histoire-Géographie": 12.0, "Physique-Chimie": 10.5}),
    ("Lina", "Moreau", "lina.moreau@demo.scoolize.fr",
     "Générale — spé SVT, Physique-Chimie", "Lycée Faidherbe",
     {"SVT": 9.5, "Physique-Chimie": 8.5, "Mathématiques": 8.0,
      "Français": 10.0, "LV1 Anglais": 9.5, "Histoire-Géographie": 10.5}),
    ("Tom", "Garcia", "tom.garcia@demo.scoolize.fr",
     "Générale — spé Mathématiques, SES", "Lycée Thiers",
     {"SES": 15.0, "Mathématiques": 14.5, "LV1 Anglais": 16.0,
      "Français": 13.5, "Histoire-Géographie": 14.0, "Philosophie": 13.0}),
]


def seed() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        schools_by_name: dict[str, School] = {}
        with open(DATA / "lycees.csv", encoding="utf-8") as fh:
            for row in csv.DictReader(fh):
                school = School(
                    name=row["name"],
                    uai_code=row["uai_code"],
                    city=row["city"],
                    region=row["region"],
                )
                db.add(school)
                schools_by_name[row["name"]] = school
        db.flush()  # attribue les id des lycées

        n_selective = 0
        with open(DATA / "formations.csv", encoding="utf-8") as fh:
            for row in csv.DictReader(fh):
                program = Program(
                    name=row["name"],
                    institution=row["institution"],
                    type=row["type"],
                    domain=row["domain"],
                    city=row["city"],
                    region=row["region"],
                    capacity=_int(row["capacity"]),
                    admission_rate=_float(row["admission_rate"]),
                    min_average=_float(row["min_average"]),
                    key_subjects=_subjects(row["key_subjects"]),
                )
                db.add(program)
                if program.type == "selective":
                    n_selective += 1

        for first, last, email, track, school_name, grades in STUDENTS:
            student = Student(
                first_name=first,
                last_name=last,
                email=email,
                hashed_password=hash_password(DEMO_PASSWORD),
                track=track,
                school_id=schools_by_name[school_name].id,
            )
            for subject, value in grades.items():
                student.grades.append(
                    Grade(subject=subject, value=value, period="Année de Terminale")
                )
            db.add(student)

        db.commit()

        n_schools = db.query(School).count()
        n_programs = db.query(Program).count()
        n_students = db.query(Student).count()
        print("Seed terminé :")
        print(f"  - {n_schools} lycées")
        print(
            f"  - {n_programs} formations "
            f"(dont {n_selective} sélectives, {n_programs - n_selective} non-sélectives)"
        )
        print(f"  - {n_students} étudiants de démo (mot de passe commun : {DEMO_PASSWORD})")
        for first, last, email, *_ in STUDENTS:
            print(f"      - {first} {last} : {email}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
