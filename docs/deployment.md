# Déploiement

Le code est prêt à déployer ; aucune commande n'est lancée automatiquement.
Voici les étapes **manuelles** à réaliser.

## Vue d'ensemble

| Composant | Plateforme conseillée | Fichier de config |
|-----------|----------------------|-------------------|
| Backend (FastAPI + OCR) | Render (Docker) | [`render.yaml`](../render.yaml), [`backend/Dockerfile`](../backend/Dockerfile) |
| Frontend (Next.js) | Vercel | [`frontend/vercel.json`](../frontend/vercel.json) |
| CI (tests + build) | GitHub Actions | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) |

## 1. Backend sur Render

1. Crée un compte sur [render.com](https://render.com) et connecte ton compte GitHub.
2. **New → Blueprint**, sélectionne le repo : Render lit `render.yaml` automatiquement.
3. Le `Dockerfile` installe Tesseract + poppler : l'OCR fonctionne donc en production.
4. Variables d'environnement (Render) :
   - `JWT_SECRET` : généré automatiquement (`generateValue: true`).
   - `CORS_ORIGINS` : mets l'URL de ton front Vercel (étape 2), ex. `https://scoolize.vercel.app`.
   - `DATABASE_URL` : SQLite par défaut (éphémère). **Pour persister les données**, crée une base PostgreSQL Render et colle son *Internal Database URL* ici.
5. Déploie. Vérifie `https://<ton-api>.onrender.com/health`.
6. (Optionnel) Lance le seed une fois via le *Shell* Render : `python scripts/seed.py`.

## 2. Frontend sur Vercel

1. Crée un compte sur [vercel.com](https://vercel.com), **Add New → Project**, importe le repo.
2. **Root Directory** : `frontend`.
3. Variable d'environnement : `NEXT_PUBLIC_API_URL` = l'URL de ton API Render (ex. `https://scoolize-api.onrender.com`).
   > Cette variable est *inlinée au build* : un changement nécessite un redéploiement.
4. Déploie. Vercel détecte Next.js automatiquement.

## 3. Boucler le CORS

Une fois le front en ligne, reviens sur Render et mets à jour `CORS_ORIGINS`
avec le domaine Vercel définitif, puis redéploie le backend.

## 4. CI

Le workflow GitHub Actions tourne sur chaque PR et push (`main`, `dev`) :
- **backend** : `pip install -r requirements.txt` puis `pytest` (le test OCR est ignoré si Tesseract est absent du runner) ;
- **frontend** : `npm ci`, `npm run lint`, `npm run build`.

Aucune action requise : le workflow est actif dès que le repo est sur GitHub.
