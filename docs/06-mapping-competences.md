# Mapping des compétences — Scoolize

Tableau de correspondance entre les compétences du référentiel d'évaluation
(fichier `compétences scoolize.xlsx` fourni par l'école) et les livrables réels du
projet Scoolize. L'auto-évaluation est volontairement honnête : une compétence dont
les preuves dépendent uniquement d'un livrable encore en cours de production se voit
attribuer une note basse, accompagnée du livrable cible qui la fera remonter.

> Le fichier source contient **21 compétences distinctes** (et non 23 comme indiqué
> dans le brief initial) — l'écart est noté tel quel, sans interpréter.

## Échelle d'auto-évaluation

| Note | Sens |
|------|------|
| 5 | Compétence pleinement couverte, preuves multiples et concrètes |
| 4 | Compétence solidement couverte, preuves substantielles |
| 3 | Compétence couverte mais perfectible / preuves partielles |
| 2 | Compétence amorcée, l'essentiel reste à livrer |
| 1 | Compétence à peine effleurée à ce stade |

## Tableau de mapping

| Ref | Compétence | Livrables / preuves Scoolize | Note | Justification |
|-----|------------|-------------------------------|:----:|---------------|
| **00.03.B07** | Rédiger un document professionnel (audit, rapport stratégique etc.) | [`docs/change-management.md`](change-management.md) (ADKAR + RGPD), [`docs/deployment.md`](deployment.md), [`docs/slides/slides.md`](slides/slides.md), [`docs/demo-script.md`](demo-script.md), [README racine](../README.md), `backend/README.md`, `frontend/README.md`, `data/README.md`. À venir : audit Parcoursup (#01), business model (#05), pack conformité (#07), dossier projet PDF (#09). | 4 | Documentation déjà substantielle et homogène ; les rapports stratégiques (audit + business) en cours hisseront la note à 5. |
| **00.05.B03** | Répondre aux questions de manière pertinente et argumentée | À venir : `docs/11-soutenance/qa-prepare.md` (20 Q&A préparées avec réponses 30–45 s, mots-clés, pièges à éviter) ; rétrospective `docs/10-retrospective.md`. | 3 | Compétence évaluée à l'oral ; le matériel de préparation est en cours. Sans le livrable #11, la preuve écrite manque. |
| **01.02.B04** | Évaluer la faisabilité d'une solution | Choix techniques justifiés (FastAPI, Tesseract local vs API SaaS, scikit-learn vs deep learning) documentés dans `backend/README.md` et le rationnel de [`change-management.md`](change-management.md). Analyse de la faisabilité OCR : fallback gracieux dans [`backend/ocr/__init__.py`](../backend/ocr/__init__.py) si binaires absents. Faisabilité juridique abordée (à compléter par #07). | 4 | La faisabilité technique est documentée et démontrée (l'app tourne) ; faisabilité juridique à compléter avec le pack conformité. |
| **01.02.B09** | Quantifier les similitudes entre les ensembles de données | [`backend/matching/__init__.py`](../backend/matching/__init__.py) : moyenne pondérée élève × matières clés de la formation, branches sélectif (régression logistique scikit-learn entraînée sur 6 000 échantillons) vs non-sélectif (affinité + capacité), facteur géographique, intervalle de confiance. [`backend/tests/test_matching.py`](../backend/tests/test_matching.py) couvre 3 profils (excellent / moyen / faible) et démontre la discrimination. | 5 | Compétence pleinement couverte par un algorithme quantitatif testé, documenté et exécuté lors de la démo. |
| **01.03.B01** | Consommer des données structurées à partir d'une source externe | [`data/lycees.csv`](../data/lycees.csv) (20 lycées) et [`data/formations.csv`](../data/formations.csv) (50 formations) chargés par [`scripts/seed.py`](../scripts/seed.py) ; consommation PDF non structurée via OCR Tesseract dans [`backend/ocr/__init__.py`](../backend/ocr/__init__.py). Sources data.gouv.fr documentées dans [`data/README.md`](../data/README.md). | 4 | Consommation CSV + OCR PDF démontrée ; remontable à 5 avec un import réel des CSV Parcoursup officiels. |
| **02.02.B05** | Créer un tutoriel | [README racine](../README.md), `backend/README.md`, `frontend/README.md`, [`docs/deployment.md`](deployment.md), [`docs/demo-script.md`](demo-script.md). À venir : kit d'onboarding étudiant et établissement (annoncés dans `change-management.md`). | 3 | Tutoriels d'installation et de démo solides ; pas encore de tuto utilisateur final illustré (sera porté par #03 et #08). |
| **02.03.B05** | Établir des partenariats et des réseaux avec d'autres organisations | À venir : `docs/05-business-model.md` — section *Partenaires clés* du Canvas (Ministère, Onisep, lycées, éditeurs scolaires) + chapitre roadmap dans `change-management.md`. | 2 | Compétence essentiellement portée par le business model (#05). Hypothèses de partenariats à formaliser ; aucun partenariat réel (projet école). |
| **02.04.B02** | Utiliser un outil de versioning pour collaborer | Repo Git `scoolize/` isolé du dépôt parent, **12 commits** thématiques sous identité réelle (`Paul Adrien Desplechin`), messages en *conventional commits* (`feat`, `chore`, `fix`, `test`, `refactor`, `docs`), trailer `Co-Authored-By: Claude` transparent. CI [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) qui valide chaque PR (lint + tests). | 4 | Historique propre et lisible, attribution honnête. Limite assumée : un seul contributeur réel à ce stade ; collaboration multi-mains à prouver via les commits d'Hugo et Nino sur leurs branches. |
| **02.04.B03** | Utiliser des outils de gestion de projet | Suivi de tâches méthodique : 25 tâches créées et fermées (étapes 1→12 du build + 2 cleanups + 11 livrables produit). Découpage en étapes documenté. À venir : plan de soutenance détaillé (#11). | 3 | Découpage et suivi rigoureux ; pas d'outil PM tiers (Jira/Notion/Linear) à montrer en capture. |
| **02.05.B02** | Respecter la vie privée et la confidentialité des informations personnelles | Mesures techniques : JWT auth ([`backend/app/security.py`](../backend/app/security.py)), hash PBKDF2 du mot de passe, dépendance `get_owned_student` qui empêche un étudiant d'accéder aux ressources d'un autre, CORS limitée. Section RGPD de [`docs/change-management.md`](change-management.md). À venir : politique de confidentialité et analyse RGPD (AIPD) dans `docs/07-conformite/`. | 4 | Mesures techniques en place et testées ; documentation RGPD complète arrive avec #07. |
| **02.06.B12** | Adapter sa stratégie de promotion en fonction des tendances, des technologies | À venir : `docs/05-business-model.md` (canaux, positionnement) + `docs/04-identite-visuelle/charte.md` (ton de voix, registre de marque). | 2 | Compétence à dominante marketing ; preuves portées par #04 et #05. À ce stade, peu de matière. |
| **03.01.B06** | Concevoir une UX ergonomique adaptée aux besoins des utilisateurs | Frontend Next.js 14 complet (8 routes), design Tailwind v4 + shadcn/Base UI, jauge SVG, drag-and-drop bulletin, validation humaine des notes (toujours), intervalle de confiance affiché. Architecture frontend nettoyée (`useStoredStudent`, `<ProfileRequired>`, `<ErrorBanner>` partagés). À venir : maquettes mockup HTML + design system formalisé (#03), personas et journeys (#02). | 4 | UX construite et testée navigateur ; les artefacts de conception structurés (personas, maquettes, design system) arrivent. |
| **05.01.B01** | Suggérer une mise en œuvre réaliste d'une idée | Architecture documentée (FastAPI + Next.js + Tesseract + scikit-learn), MVP exécutable de bout en bout en local, configuration de déploiement réelle (Vercel + Render), CI GitHub Actions. | 4 | Mise en œuvre concrète, exécutable, et reproductible (`docker build` + `npm run dev`). |
| **05.01.B02** | Fournir un prototype convaincant | MVP entièrement fonctionnel : `register → upload OCR → notes → match → candidature → vue école`. OCR réel testé sur 3 bulletins de démo (extraction parfaite : 18,0 / 17,0 / 16,5…). 21 tests automatisés verts. Captures d'écran du parcours dans la session de revue (Predict + landing + Prepare). | 5 | Prototype démontré bout-en-bout via HTTP et navigateur ; preuves multi-formats. |
| **05.02.B08** | Tenir compte des aspects juridiques d'un projet | Section RGPD dans [`docs/change-management.md`](change-management.md), LICENSE MIT à la racine, anonymisation des étudiants de démo. À venir : CGU, mentions légales, AIPD, SLA dans `docs/07-conformite/` (#07). | 3 | Bases posées ; le pack juridique complet (#07) fera passer la note à 4+. |
| **05.03.B07** | Créer des prototypes interactifs pour tester et valider des idées innovantes | Le prototype Scoolize lui-même est interactif. À venir : mockups HTML statiques cliquables (#03) et démo live scriptée ([`docs/demo-script.md`](demo-script.md) déjà présente). | 4 | Prototype interactif livré ; mockups annexes ajoutent une variante de support. |
| **06.04.B01** | Étudier le marché et analyser la concurrence | À venir : `docs/05-business-model.md` partie B (analyse vs Parcoursup, Diplomeo, Studyrama, l'Étudiant, Onisep, etc., tableau comparatif et carte de positionnement). | 2 | Pas encore livré ; sera couvert intégralement par #05. |
| **06.04.B02** | Élaborer des stratégies marketing et commerciales | À venir : `docs/05-business-model.md` partie C (3 modèles économiques chiffrés : service public, hybride freemium, B2B). | 2 | Pas encore livré ; sera couvert par #05. |
| **06.06.B02** | Maîtriser les outils et canaux de communication adapté à la stratégie de communication | Charte éditoriale et identité (#04 — à venir), matériel de soutenance multi-format (#11 — à venir) : pitch oral, slides, démo scriptée, cheatsheet, Q&A préparées. | 3 | Canaux variés prévus ; preuve écrite arrive avec #04 et #11. |
| **07.05.B02** | Concevoir et améliorer l'offre de produits et services | Itération mesurable de l'algorithme : v1 placeholder → v2 affinée avec pénalité de couverture des matières clés (commit `3ffe2f0` puis affinage). Refactor `backend` (deps partagées, `joinedload`, lazy sklearn) et `frontend` (hook + composants partagés) — commits `4cb1a19` et `3743b48`. Rétrospective à venir (#10) documente la logique d'itération. | 4 | Démonstration d'amélioration produit itérative, traçable dans Git. |
| **07.05.B04** | Tester et valider les produits et services | 21 tests pytest (API endpoints, OCR parser, matching), build Next.js vert sur 12 routes, intégration end-to-end testée via HTTP live, vérification CORS. À venir : tests utilisateurs qualitatifs (3-4 interviews — guide #08). | 4 | Couche tests automatisés solide ; tests utilisateurs hisseront à 5. |

## Synthèse

### Notes actuelles

- **Moyenne pondérée** : ≈ **3,4 / 5**
- **Distribution** : 2× notes à 5 ; 9× à 4 ; 6× à 3 ; 4× à 2 ; 0× à 1.

### Compétences les mieux couvertes (note 4–5)

| Ref | Compétence | Pourquoi |
|-----|------------|----------|
| 01.02.B09 | Quantifier les similitudes | Algorithme matching scikit-learn testé sur 3 profils. |
| 05.01.B02 | Prototype convaincant | MVP démontré bout-en-bout, OCR réel parfait, 21 tests verts. |
| 03.01.B06 | UX ergonomique | 8 routes Next.js, design system Tailwind v4 + shadcn, validation humaine. |
| 00.03.B07 | Rédaction professionnelle | Docs techniques + change management + slides + demo déjà livrés. |
| 02.04.B02 | Versioning Git | 12 commits propres en *conventional commits* sous identité réelle. |
| 02.05.B02 | Vie privée / confidentialité | JWT + hash PBKDF2 + dépendance d'autorisation + section RGPD. |

### Compétences moins bien couvertes (note 2)

| Ref | Compétence | Plan d'action |
|-----|------------|---------------|
| 02.03.B05 | Partenariats | Livrable #05 (Canvas, partenaires clés). |
| 02.06.B12 | Stratégie de promotion | Livrables #04 (identité) et #05 (canaux). |
| 06.04.B01 | Étude marché et concurrence | Livrable #05 partie B (tableau comparatif, carte de positionnement). |
| 06.04.B02 | Stratégies marketing et commerciales | Livrable #05 partie C (3 modèles économiques). |

### Cible après production de l'intégralité des livrables

Une fois les 11 livrables produit (audit Parcoursup, personas, maquettes,
identité visuelle, business model, conformité, tests utilisateurs, rétrospective,
matériel oral, dossier projet PDF) intégrés au repo :

- **Moyenne pondérée cible** : ≈ **4,1 / 5**
- **Aucune note** sous 3 (les 4 notes à 2 remontent toutes via #04 et #05).
- **6 à 8 notes à 5** attendues.

### Limites assumées (pour ne rien cacher au jury)

- **Collaboration équipe** : à ce stade, l'historique Git ne montre qu'un seul
  contributeur réel ; Hugo et Nino doivent commiter eux-mêmes leur part pour que
  la compétence *versioning collaboratif* soit pleinement justifiable.
- **Tests utilisateurs réels** : non encore conduits ; les 3-4 interviews
  prévues (livrable #08) sont décisives pour passer de la *conception UX* à la
  *UX validée*.
- **Données réelles Parcoursup** : les datasets utilisés sont *plausibles* mais
  hand-crafted (documenté tel quel dans `data/README.md`). Un import réel des
  CSV officiels data.gouv.fr renforcerait *01.03.B01*.
- **Compétence orale (00.05.B03)** : ne peut être pleinement validée qu'à
  l'oral lors de la soutenance ; le matériel de préparation (#11) en est la
  preuve indirecte.
