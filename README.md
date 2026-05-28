# Scoolize

> L'orientation post-bac, en plus clair que Parcoursup.

**Statut : en développement actif.** 

Scoolize est une plateforme d'orientation scolaire qui aide étudiants et
établissements à mieux se rencontrer. Elle se décompose en deux faces :

- **Prepare** (côté écoles) — déclarer les compétences attendues et les critères
  d'admission d'une formation.
- **Predict** (côté étudiants) — uploader son bulletin, laisser l'OCR extraire les
  notes, et découvrir les formations qui matchent avec une estimation de
  probabilité d'admission.

## Le problème

Parcoursup est souvent vécu comme opaque : peu de visibilité sur ses chances
réelles, pas de distinction claire entre formations sélectives et non-sélectives,
saisie des notes fastidieuse. Scoolize attaque ces trois points.

## Ce que fait Scoolize

- **OCR des bulletins** (Tesseract) : fini la saisie manuelle ; l'étudiant valide
  ensuite les notes extraites.
- **Matching transparent** : un score de correspondance par formation, avec
  intervalle de confiance, et deux logiques distinctes selon que la formation est
  sélective ou non.
- **Vision produit** : un parcours étudiant lisible et un dashboard école utile.

## Stack

| Couche   | Technos |
|----------|---------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui, Recharts |
| Backend  | FastAPI (Python 3.11), SQLAlchemy, SQLite (dev) / PostgreSQL (prod) |
| OCR      | Tesseract via pytesseract |
| Matching | Python + scikit-learn |
| Données  | Open data Parcoursup (data.gouv.fr) + base lycées |

## Structure du repo

```
scoolize/
├── frontend/     # application Next.js (Prepare + Predict)
├── backend/      # API FastAPI
│   ├── app/      # modèles, schémas, routes, config
│   ├── ocr/      # extraction des notes depuis les bulletins PDF
│   ├── matching/ # algorithme de scoring
│   └── tests/    # tests pytest
├── data/         # CSV formations/lycées, bulletins d'exemple
├── docs/         # specs, change management, slides
└── scripts/      # seed de la base, génération de bulletins
```

## Lancement local

### Pré-requis
- Python 3.11+
- Node.js 18+
- Tesseract OCR
  - macOS : `brew install tesseract tesseract-lang`
  - Debian/Ubuntu : `sudo apt install tesseract-ocr tesseract-ocr-fra`

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python ../scripts/seed.py        # peuple la base de démo (20 lycées, 50 formations, 5 étudiants)
uvicorn app.main:app --reload
# API : http://localhost:8000 — docs interactives : http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App : http://localhost:3000
```

## Données de démonstration

Après le seed, 5 comptes étudiants sont disponibles (mot de passe commun
`demo1234`), par ex. `lea.martin@demo.scoolize.fr`. Des bulletins PDF d'exemple
sont fournis dans [`data/sample_bulletins/`](data/sample_bulletins/) pour tester
l'OCR de bout en bout.

## Documentation

- [Déploiement](docs/deployment.md) — Vercel + Render + CI (étapes manuelles)
- [Conduite du changement](docs/change-management.md) — ADKAR + RGPD
- [Slides de soutenance](docs/slides/slides.md) · [Script de démo](docs/demo-script.md)
- [Données & sources](data/README.md)

## Équipe

| Membre | Domaine |
|--------|---------|
| Paul-Adrien Desplechin | Backend, OCR, algorithme de matching, intégration |
| Hugo | Frontend Predict (parcours étudiant) |
| Nino | Frontend Prepare (parcours école) |

## Licence

MIT — voir [LICENSE](LICENSE).
