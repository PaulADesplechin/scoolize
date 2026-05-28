# Script de démo live (≈ 5 min)

> Pré-requis : backend lancé (`uvicorn app.main:app`) + base seedée
> (`python scripts/seed.py`) + frontend lancé (`npm run dev`).
> Avoir sous la main `data/sample_bulletins/bulletin_lea_martin.pdf`.

---

### 0:00 — Le problème (30 s)
> « Parcoursup, c'est 900 000 lycéens qui formulent des vœux sans savoir s'ils ont
> une chance. Scoolize rend ça lisible. Deux faces : Predict pour l'étudiant,
> Prepare pour l'école. »

Afficher la **landing** (`/`).

---

### 0:30 — Predict : profil + OCR (2 min)
1. Cliquer **« Je suis étudiant »** → `/predict`.
2. Créer un profil (prénom, nom, email, mot de passe, lycée). → on arrive sur l'upload.
3. **Glisser-déposer** `bulletin_lea_martin.pdf`. Cliquer **« Analyser le bulletin »**.
   > « Aucune saisie manuelle : Tesseract lit le bulletin. »
4. Sur `/predict/grades`, montrer les notes **pré-remplies** (Maths 18, Physique 17…).
   > « L'OCR propose, l'élève valide — la validation humaine reste la règle. »
5. Cliquer **« Valider et voir mes formations »**.

---

### 2:30 — Résultats & candidature (1 min)
1. Sur `/predict/results` : le **top 10** classé, le **graphique** des scores,
   les badges **Sélective / Non-sélective** et **Éligible**.
2. Pointer une carte : score, **probabilité d'admission**, intervalle de confiance,
   explication.
3. Jouer un **filtre** (région ou type).
4. Cliquer **« Candidater »** sur une formation → toast de confirmation.

---

### 3:30 — Prepare : côté école (1 min)
1. Aller sur **Prepare** (`/prepare`) : tableau de bord, compteurs (formations,
   candidatures).
2. Ouvrir **« Candidats »** : la candidature qu'on vient d'envoyer apparaît, avec
   le **score** et le lycée.
3. Cliquer **« Exporter en CSV »**.
4. (Optionnel) **« Nouvelle formation »** : montrer le formulaire de critères +
   matières clés pondérées.

---

### 4:30 — Sous le capot & vision (30 s)
> « Derrière : FastAPI, OCR Tesseract, un matching scikit-learn qui distingue
> sélectif et non-sélectif et renvoie une probabilité d'admission avec intervalle
> de confiance. Et un plan de conduite du changement ADKAR pour une coexistence
> avec Parcoursup sur deux ans. »

Conclure sur la slide **Roadmap**.
