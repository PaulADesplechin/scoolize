# Checklist soutenance — Scoolize

Aide-mémoire opérationnel pour le jour J. Voir aussi
[`docs/11-soutenance/`](docs/11-soutenance/) (pitch, plan, démo, Q&A, cheatsheet).

---

## 1. Lancer l'app (15 min avant)

```bash
# Terminal 1 — backend
cd backend
./.venv/bin/python ../scripts/seed.py        # réinitialise la base de démo
./.venv/bin/uvicorn app.main:app --port 8000 # API + /docs

# Terminal 2 — frontend
cd frontend
npm run dev        # http://localhost:3000 (ou -- -p 3001 si occupé)
```

Vérifie : `http://localhost:8000/health` répond `ok`, la landing s'ouvre.

## 2. Comptes étudiants de démo

Mot de passe commun : **`demo1234`**

| Profil | Email | Pour montrer |
|--------|-------|--------------|
| Excellente scientifique | `lea.martin@demo.scoolize.fr` | Top sélectif (BUT GEII, écoles ingé, ~94) |
| Moyen | `noah.petit@demo.scoolize.fr` | Licences non-sélectives (~66) |
| En difficulté | `lina.moreau@demo.scoolize.fr` | Licences accessibles (~58) |
| Éco / commerce | `tom.garcia@demo.scoolize.fr` | Formations commerce/gestion |

> Onglet **« Se connecter »** sur `/predict` → reconnexion directe sans recréer.

## 3. Bulletins à uploader

Dossier [`data/sample_bulletins/`](data/sample_bulletins/) :

- `bulletin_lea_martin.pdf` → profil excellent scientifique
- `bulletin_noah_petit.pdf` → profil moyen
- `bulletin_lina_moreau.pdf` → profil en difficulté

## 4. Plan de démo (5 min)

1. **Landing** → « Je suis étudiant ».
2. **Créer un compte** (ou se connecter avec Léa).
3. **Upload** `bulletin_lea_martin.pdf` → « Analyser le bulletin » → OCR.
4. **Notes** pré-remplies → corriger si besoin → valider.
5. **Résultats** : encart profil, top 10, graphique, badges, candidater.
6. **Prepare** : tableau de bord, camembert, **candidats** → cliquer une ligne →
   page détail (graphes évolution + comparatif), export CSV.

Détail mot à mot : [`docs/11-soutenance/demo-script.md`](docs/11-soutenance/demo-script.md).

## 5. Solutions de contournement (si bug en live)

| Problème | Contournement |
|----------|---------------|
| **OCR plante** | Bouton « Saisir mes notes à la main » sur l'upload → saisie rapide de 4-5 notes. Dis : « c'est le fallback prévu ». |
| **Auth plante** | Crée un compte avec un email tout neuf : `demo+<timestamp>@scoolize.fr`. |
| **Port 3000 occupé** | `npm run dev -- -p 3001` et adapte l'URL. |
| **Base vide / incohérente** | Relance `python scripts/seed.py` (réinitialise tout). |
| **CORS en navigateur** | Le backend autorise déjà tout `localhost:*` en dev. |
| **Front crash** | Recharge la page (rare). |
| **Tout plante** | Lance la vidéo Loom de backup, commente à voix haute. |

## 6. Où trouver les infos pour les questions du jury

| Question probable | Doc / section |
|-------------------|---------------|
| Chiffres Parcoursup | [`docs/01-audit-parcoursup.md`](docs/01-audit-parcoursup.md) §3 |
| Pourquoi Tesseract / l'algo | [`docs/11-soutenance/qa-prepare.md`](docs/11-soutenance/qa-prepare.md) Q1-Q5 |
| Modèle économique | [`docs/05-business-model.md`](docs/05-business-model.md) partie C |
| RGPD / mineurs | [`docs/07-conformite/analyse-rgpd.md`](docs/07-conformite/analyse-rgpd.md) |
| Reproches V1 → V2 | [`README.md`](README.md) + [`docs/10-retrospective.md`](docs/10-retrospective.md) |
| Compétences couvertes | [`docs/06-mapping-competences.md`](docs/06-mapping-competences.md) |
| Dossier complet | [`docs/09-dossier-projet/dossier-scoolize.pdf`](docs/09-dossier-projet/dossier-scoolize.pdf) (17 p.) |

## 7. À faire avant de partir

- [ ] App lancée et testée (parcours complet une fois).
- [ ] Vidéo Loom de backup ouverte dans un onglet.
- [ ] [`cheatsheet`](docs/11-soutenance/cheatsheet.md) imprimée, pliée en 4.
- [ ] Téléphone chargé + hotspot configuré.
- [ ] Pitch d'ouverture su par cœur.
