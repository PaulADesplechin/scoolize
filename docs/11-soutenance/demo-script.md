# Script de démo — Soutenance (5 minutes)

> Cette version est dédiée à la soutenance. Elle inclut le **plan B**
> (saisie manuelle) et le **plan C** (vidéo de secours). Version
> originale plus courte dans [`../demo-script.md`](../demo-script.md).

## Prérequis (à vérifier 15 minutes avant la soutenance)

- [ ] Backend lancé : `cd backend && uvicorn app.main:app` → `/health` répond.
- [ ] Base seedée : `python scripts/seed.py` → 50 formations.
- [ ] Frontend lancé : `cd frontend && npm run dev` (ou `start`) sur **un port libre**.
- [ ] `data/sample_bulletins/bulletin_lea_martin.pdf` accessible depuis le bureau.
- [ ] Hotspot téléphone configuré et testé.
- [ ] Vidéo backup `demo-backup.mp4` ouverte dans un onglet, prête à lecture.

---

## Étape 0 — Préparation pré-démo (cachée du jury)

- Onglet 1 : `/` (landing) — affiché pendant le pitch.
- Onglet 2 : `/predict` (profil) — page suivante.
- Bureau bien rangé, dock minimal.
- Police du navigateur en zoom 110 % minimum.

---

## Étape 1 — 0:00 → 0:30 — Le problème en 2 phrases

> *« Parcoursup, 900 000 lycéens, qui formulent leurs vœux sans
> savoir s'ils ont une chance. Scoolize, c'est la couche de lisibilité
> qui manque. Deux faces : Predict pour l'étudiant, Prepare pour
> l'école. »*

Afficher la **landing** (`/`).

---

## Étape 2 — 0:30 → 2:30 — Predict : profil + OCR

1. Cliquer **« Je suis étudiant »** → `/predict`.
2. Créer le profil (prénom **Léa**, nom **Martin**, email, mot de
   passe `demo1234`, lycée Louis-le-Grand, spécialités Maths /
   Physique-Chimie).
3. Sur la page Upload, **glisser-déposer** `bulletin_lea_martin.pdf`.
   Cliquer **« Analyser le bulletin »**.
   > *« Aucune saisie manuelle. Tesseract lit votre bulletin. »*
4. Sur `/predict/grades`, montrer les **notes pré-remplies** (Maths
   18,0 ; Physique-Chimie 17,0 ; NSI 16,5 ; etc.).
   > *« L'OCR propose, l'élève valide. La validation humaine reste la
   > règle. »*
5. Cliquer **« Valider et voir mes formations »**.

### Plan B — Si l'OCR plante (Tesseract HS, fichier illisible)

> *« Le fallback est exactement celui qu'on a documenté : saisie
> manuelle. »*

1. Sur l'écran Upload, cliquer **« Saisir mes notes à la main »**.
2. Sur `/predict/grades`, saisir 4-5 notes rapidement (Maths 18, PC 17,
   NSI 16,5, Français 14).
3. Cliquer **« Valider et voir mes formations »**.

→ Tu **ne perds pas la démo**, tu démontres juste un cas de fallback.

---

## Étape 3 — 2:30 → 3:30 — Résultats + candidature

1. Sur `/predict/results` :
   - Pointer le **top 10** classé.
   - Pointer le **graphique** comparatif des scores.
   - Pointer les **badges** Sélective / Non-sélective et Éligible.
2. Cliquer sur une carte, lire le rationale :
   > *« Probabilité d'admission estimée à 89 %, moyenne matières
   > clés 17,2 sur 20, seuil indicatif 12. Et un intervalle de
   > confiance affiché. »*
3. Jouer un **filtre** (par exemple, type = Sélectives).
4. Cliquer **« Candidater »** sur une formation → toast de
   confirmation.

---

## Étape 4 — 3:30 → 4:30 — Prepare : côté école

1. Aller sur **Prepare** (`/prepare`) :
   > *« Côté école, vue d'ensemble : 50 formations déclarées, dont
   > 28 sélectives, et 1 candidature. »*
2. Cliquer **« Candidats »** : la candidature qu'on vient d'envoyer
   apparaît, avec le **score figé** au moment de la candidature et le
   **lycée**.
3. Cliquer **« Exporter en CSV »** — montrer le fichier qui se
   télécharge.
   > *« Ce CSV alimente directement la commission d'examen des vœux
   > sans re-saisie. »*
4. (Optionnel si temps) Cliquer **« + Nouvelle formation »** pour
   montrer le formulaire de critères + matières clés pondérées.

---

## Étape 5 — 4:30 → 5:00 — Conclusion

> *« Derrière : FastAPI, Tesseract, scikit-learn. Algorithme qui
> distingue sélectif et non-sélectif, renvoie une probabilité
> d'admission avec intervalle de confiance. Documentation produit
> complète : audit Parcoursup, personas, business model, conformité
> RGPD, charte graphique. Et un plan de conduite du changement ADKAR
> pour deux ans de coexistence avec Parcoursup. »*

Reprendre la slide suivante (Architecture).

---

## Plan C — Si tout plante (wifi, ordi, serveur)

> *« On a anticipé. Voici la démo enregistrée. »*

1. Couper la démo live.
2. Basculer sur l'onglet `demo-backup.mp4`.
3. Lire la vidéo (4 min) en commentant à voix haute les actions
   qu'on aurait faites.
4. Ne pas s'excuser pendant 30 secondes — passer à la suite.

---

## Mantras anti-stress pour la démo

- Si une page met 3 secondes à charger : **respire**, ne meuble pas
  avec *« euh… »*. Le silence est ok.
- Si tu cliques au mauvais endroit : *« Pardon, je reprends. »* et tu
  reprends. Pas de panique.
- Si la jury pose une question pendant la démo : *« Très bonne
  question, je note et j'y réponds après la démo. »*
