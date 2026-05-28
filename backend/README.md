# Scoolize — Backend (FastAPI)

API REST : étudiants, formations, OCR des bulletins et matching étudiant ↔ formation.

## Pré-requis

- Python 3.11+
- Tesseract OCR + poppler (pour l'OCR) :
  - macOS : `brew install tesseract tesseract-lang poppler`
  - Debian/Ubuntu : `sudo apt install tesseract-ocr tesseract-ocr-fra poppler-utils`

## Lancement

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python ../scripts/seed.py        # peuple la base de démo
uvicorn app.main:app --reload    # http://localhost:8000/docs
```

## Tests

```bash
pytest
```

Le test d'intégration OCR est ignoré automatiquement si Tesseract n'est pas
installé ; les tests du parser, de l'API et du matching tournent dans tous les cas.

## Structure

```
app/
  config.py      # réglages (env)
  database.py    # SQLAlchemy
  models.py      # Student, School, Program, Grade, Application
  schemas.py     # Pydantic
  security.py    # hash mot de passe + JWT
  deps.py        # dépendance d'auth
  routers/       # auth, students, programs, schools, matching, applications, prepare
ocr/             # extraction des notes (Tesseract + parser regex FR)
matching/        # scoring (scikit-learn) — branches sélectif / non-sélectif
tests/           # pytest
```

## Endpoints principaux

| Méthode | Route | Rôle |
|---------|-------|------|
| POST | `/api/students` | Créer un étudiant (inscription) |
| POST | `/api/auth/login` | Obtenir un token JWT |
| GET | `/api/students/{id}` | Profil + notes |
| POST | `/api/students/{id}/grades` | Ajouter des notes *(auth)* |
| POST | `/api/students/{id}/upload` | Bulletin PDF → OCR *(auth)* |
| GET | `/api/programs` | Formations (filtres `type`, `region`, `domain`, `q`) |
| POST | `/api/programs` | Créer une formation (Prepare) |
| GET | `/api/schools` | Lycées |
| GET | `/api/match/{id}` | Top formations matchées |
| POST | `/api/applications` | Candidater *(auth)* |
| GET | `/api/candidates` | Candidats côté école (Prepare) |
| GET | `/health` | Healthcheck |

## Authentification

JWT côté étudiant. Les 5 comptes de démo (après seed) partagent le mot de passe
`demo1234` (ex. `lea.martin@demo.scoolize.fr`).
