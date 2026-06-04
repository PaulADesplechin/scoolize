---
title: "Scoolize — Dossier projet"
subtitle: "Plateforme d'orientation post-bac"
author: "Paul-Adrien Desplechin · Hugo · Nino"
date: "Juin 2026"
---

# Synthèse exécutive

**Scoolize** est une plateforme d'orientation post-bac qui rend lisibles les
chances réelles d'admission. Elle se compose de deux faces : **Predict**
(côté étudiant — upload du bulletin, OCR, score expliqué, intervalle de
confiance) et **Prepare** (côté école — déclaration des formations,
tableau de bord des candidats, export CSV). L'algorithme distingue
explicitement les formations **sélectives** (probabilité d'admission)
des formations **non-sélectives** (affinité × capacité résiduelle).

Le projet s'inscrit dans une **commande du Ministère de l'Enseignement
supérieur et de la Recherche** visant à compléter Parcoursup là où le
portail est aujourd'hui critiqué : opacité des algorithmes locaux,
saisie manuelle fastidieuse, absence d'estimation individualisée des
chances.

Le dossier formalise les onze livrables produits — audit Parcoursup,
personas, maquettes, identité visuelle, business model, conformité
RGPD, change management ADKAR, tests utilisateurs, rétrospective,
matériel de soutenance — et l'architecture technique (FastAPI +
Next.js 14 + Tesseract + scikit-learn). 21 tests automatisés
verrouillent les régressions. Le prototype fonctionne de bout en bout
(register → upload OCR → notes → match → candidature → vue école)
et a été démontré en navigateur.

---

# Chapitre 1 — Contexte et audit Parcoursup

> Document source complet : [`docs/01-audit-parcoursup.md`](../01-audit-parcoursup.md)

## Historique

Parcoursup, créé par la **loi ORE du 8 mars 2018**, succède à APB
(2009-2017) en supprimant le tirage au sort en filières en tension.
Le portail unique gère désormais l'inscription d'environ **900 000
candidats** annuels vers **21 000 formations**, pour un total de
~7 millions de vœux confirmés.

## Points de douleur identifiés

Classés par sévérité :

**Critique** — opacité des algorithmes locaux des formations,
anxiété massive documentée par la presse et les associations,
inégalités sociales et territoriales accentuées par la procédure.

**Élevé** — saisie manuelle des notes, charge des lettres de
motivation, délais d'attente longs, absence de visibilité sur les
chances individuelles.

**Moyen** — limite à 10 vœux + sous-vœux complexes en licence,
distinction sélectif/non-sélectif floue côté usager, UX
vieillissante du portail.

## Critiques publiques

La Cour des comptes (rapport 2020-2021) a explicitement pointé
l'opacité des algorithmes locaux. L'IGÉSR a publié plusieurs rapports
sur les CEV. Les syndicats UNEF et FAGE demandent une réintroduction
d'une forme de hiérarchisation et un droit à l'accompagnement.

## Opportunités pour Scoolize

Quatre opportunités alignées sur les points de douleur :

1. Estimation transparente des chances (résout la sévérité critique).
2. OCR du bulletin (résout une friction de sévérité élevée).
3. Distinction explicite sélectif / non-sélectif.
4. Accompagnement gratuit pour les profils non outillés (équité).

---

# Chapitre 2 — Vision produit

> Document source complet : [`docs/02-personas-journeys.md`](../02-personas-journeys.md)

## Cinq personas

Trois étudiants — **Léa Martin** (17 ans, terminale générale, profil
scientifique excellent, vise CPGE) ; **Maxime Petit** (17 ans,
terminale STMG, profil moyen, sans projet) ; **Aïcha Diallo** (18
ans, terminale L, première génération étudiante, pas de réseau
familial dans le sup). Deux acteurs établissements — **Mme Bernard**
(45 ans, responsable d'un BUT Informatique, 850 dossiers en 3
semaines) ; **M. Lavigne** (52 ans, directeur d'une école d'ingé
post-bac privée).

## User journeys

Deux journeys détaillés (Léa et Mme Bernard) couvrent chaque étape
sur Scoolize avec **action**, **émotion**, **touchpoint**, et
**opportunité d'amélioration**. La démarche permet d'identifier les
moments d'angoisse (attente, vérification du score), les moments de
soulagement (validation OCR, candidature confirmée), et les zones
sous-investies du produit (détail formation, mise à jour des notes
entre trimestres).

## Sept insights structurants

1. *On veut comprendre, pas juste un score.*
2. *La lisibilité doit être inversement proportionnelle au capital
   social.*
3. *Le bulletin PDF est un point de bascule émotionnel.*
4. *Sélectif et non-sélectif sont deux univers mentaux distincts.*
5. *Côté école, le frein numéro 1 est le temps.*
6. *L'écosystème est défiant — il faut prouver, pas raconter.*
7. *L'orientation est un parcours, pas un événement.*

Ces insights ont guidé chaque écran de l'interface et chaque section
de la documentation.

---

# Chapitre 3 — Design et maquettes

> Document source complet : [`docs/03-maquettes/`](../03-maquettes/)

## Design system

Le design system est documenté dans [`00-design-system.md`](../03-maquettes/00-design-system.md). Il couvre l'échelle d'espacement
(4-8-12-16-24-32-48-64 px), les border-radius, les composants
atomiques (Button avec 5 variantes, Input, Select, Card, Badge, Tag,
Avatar, Modal, Toast, Table, Skeleton), un composant Scoolize-
spécifique (`ScoreGauge`), une *zone drag-and-drop*, et les patterns
récurrents (formulaire, liste+filtre, hero, carte formation).

L'iconographie repose sur **Lucide** (déjà utilisée dans le
produit). Le responsive est mobile-first avec breakpoints Tailwind
standards. L'accessibilité vise WCAG AA (contrastes ≥ 4.5:1 pour le
texte, focus visible 3 px, cibles tap ≥ 44 px sur mobile).

## Dix écrans spécifiés

| Lettre | Écran |
|:------:|-------|
| A | Landing |
| B | Predict — Profil étudiant |
| C | Predict — Upload bulletin |
| D | Predict — Édition des notes |
| E | Predict — Résultats |
| F | Predict — Détail formation |
| G | Prepare — Tableau de bord |
| H | Prepare — Nouvelle formation |
| I | Prepare — Liste candidats |
| J | Prepare — Détail candidat |

Chaque écran a sa **spec** (objectif, persona, wireframe ASCII,
composants, comportements, états) et son **mockup HTML autonome**
avec Tailwind CDN, utilisable comme référence Figma.

---

# Chapitre 4 — Identité visuelle

> Document source complet : [`docs/04-identite-visuelle/charte.md`](../04-identite-visuelle/charte.md)

## Marque

**Manifeste** — Scoolize rend lisibles les chances réelles
d'admission, là où Parcoursup affiche des taux historiques sans
personnalisation.

**Personnalité** — clair, sérieux, accessible, honnête, optimiste.

**Ton de voix** — phrases courtes et factuelles ; donner le chiffre
puis l'expliquer en une ligne ; tutoyer le candidat ; pas de jargon
non explicité ; pas de promesses irréalistes ; pas d'emojis dans le
produit.

## Palette

Bleu Scoolize `#4263eb` comme couleur primaire (registre confiance,
transparence, proche du registre des institutions Sciences Po / MIT).
Neutres `oklch` chauds pour le lisible. Couleurs sémantiques
calmes : `success` `#16a34a`, `warning` `#d97706`, `destructive`
`#dc2626`. Cinq couleurs de chart distinctes.

## Logo

Une **toque universitaire** (*mortarboard*) stylisée en losange,
avec une tige et une pampille, en bleu Scoolize. Variantes
fournies : `logo.svg` (complet), `logo-mark.svg` (symbole seul),
`logo-white.svg` (variante blanche pour fond sombre),
`favicon.svg` (32 px sur fond bleu).

Règles d'usage — espace de protection (hauteur du symbole), tailles
minimales (120 px logo complet, 16 px favicon), fonds autorisés
(blanc, gris clair, bleu primary avec variante blanche), interdits
(rotation, distorsion, ombre portée, fond bruité).

---

# Chapitre 5 — Business model et concurrence

> Document source complet : [`docs/05-business-model.md`](../05-business-model.md)

## Business Model Canvas

Les 9 blocs sont formalisés. **Segments** : étudiants, familles,
lycées, établissements publics, établissements privés, MESR.
**Proposition de valeur** : matching transparent (côté étudiant),
dashboard candidats (côté école). **Canaux** : web, partenariats
lycées, ENT, salons. **Ressources clés** : équipe tech (3 à 5 ETP),
produit/UX (1-2 ETP), partenariats institutionnels, DPO.

## Analyse concurrentielle

Le tableau compare Scoolize à Parcoursup, Onisep, Diplomeo,
Studyrama, l'Étudiant, MonOrientationEnLigne. Scoolize se positionne
dans le quadrant **personnalisation forte × transparence**, là où
les autres acteurs sont, soit personnalisés mais opaques (Diplomeo),
soit transparents mais non personnalisés (Onisep, Parcoursup).

Trois différenciateurs : **matching expliqué** (pas un score noir),
**OCR bulletin natif**, **distinction explicite** sélectif /
non-sélectif.

## Modèle économique recommandé

Trois scénarios sont chiffrés : service public 100 %, hybride
freemium, B2B uniquement.

**Recommandation : scénario hybride freemium**. Subvention MESR
~1 M€/an (préserve la mission de service public et l'universalité
étudiante) + abonnements Premium écoles (5-15 k€/an, 200 cibles en
an 3, ~2 M€). Marge brute estimée ~47 % en année 3. **Règle d'or**
écrite dans les CGU : le ranking n'est jamais influencé par le
statut payant d'une école.

## KPIs

Côté produit : étudiants inscrits (cible an 3 : 150 000), taux
d'activation (75 %), taux de candidature (50 %), NPS étudiant (50).
Côté business : ARR Premium (2 M€), CAC école (< 2 k€), marge brute
Premium (70 %).

---

# Chapitre 6 — Architecture technique

## Vue d'ensemble

```
[Frontend Next.js 14 — Predict + Prepare]
        ↓ HTTPS + JWT
[API FastAPI — auth, students, programs, schools, match, applications, candidates]
        ↓
[OCR Tesseract]   [Matching scikit-learn]   [PostgreSQL / SQLite]
```

## Backend FastAPI (Python 3.11)

- **Modèles SQLAlchemy** : Student, School (lycée), Program, Grade,
  Application.
- **JWT** signé HS256 + hash mot de passe PBKDF2-HMAC-SHA256
  (200 000 itérations).
- **Dépendances FastAPI** réutilisables : `get_or_404`,
  `get_current_student`, `get_owned_student`.
- **Modules métier** : `ocr/` (Tesseract avec fallback gracieux),
  `matching/` (régression logistique, lazy load via `lru_cache`).
- **21 tests pytest** (API, OCR parser, matching), CI GitHub Actions.

## Frontend Next.js 14

- **App Router**, TypeScript strict.
- **Tailwind v4** + **shadcn/ui** (Base UI), **Recharts**.
- **Composants partagés** : `<ProfileRequired>`, `<ErrorBanner>`,
  `<ScoreGauge>`, `<ProgramCard>`. Hook `useStoredStudent()`. Client
  API typé.
- 12 routes statiques compilées sans erreur.

## L'algorithme en une formule (sélectif)

$$ \text{Score} = 100 \cdot \big(0{,}5 \cdot P_\text{admission} + 0{,}4 \cdot \text{affinité}_\text{ajustée} + 0{,}1 \cdot \text{géo}\big) $$

où $P_\text{admission}$ provient d'une régression logistique entraînée
sur des couples (marge_au_seuil, sélectivité) à partir d'un historique
synthétique déterministe (graine fixée), et où l'affinité ajustée
pénalise les formations dont aucune matière clé n'est connue de
l'étudiant.

## Déploiement

`Dockerfile` backend avec Tesseract + poppler préinstallés.
`render.yaml` (Blueprint Render). `vercel.json` (frontend). CI
GitHub Actions sur PR (lint + tests). Variables d'environnement
documentées via `.env.example`.

## Métriques de qualité

- **OCR** : 3/3 bulletins de test, 100 % des matières extraites
  correctement.
- **Matching** : ordering discrimine correctement (profil excellent
  scientifique → BUT GEII 94, Bachelor ECE 93, BUT Info 93 ; profil
  faible → licences non-sélectives autour de 65).
- **Tests** : 21 verts sur API, OCR parser et matching.

---

# Chapitre 7 — Conformité RGPD

> Documents sources complets : [`docs/07-conformite/`](../07-conformite/)

## Politique de confidentialité

Responsable de traitement : MESR (commanditaire) / EPI'Gency Digital
pour le projet école. DPO : `dpo@scoolize.fr`. Données collectées :
identité, scolarité, notes, logs. **Bulletins PDF non conservés
après extraction**. Durées de conservation : profil 6 mois, compte
3 ans, logs 12 mois. Destinataires : uniquement les formations
auxquelles l'étudiant candidate.

**Droits** : accès, rectification, effacement (effectif sous 30
jours), portabilité (JSON), opposition. **Pas de décision
entièrement automatisée** (art. 22 RGPD) — le score est une aide à
la décision, la candidature est un acte volontaire.

## Cas des mineurs

Consentement parental obligatoire pour les utilisateurs de moins de
15 ans (art. 8 RGPD), via une case dédiée à l'inscription et une
page d'information parent.

## Analyse d'impact (AIPD simplifiée)

Sept risques identifiés et scorés avant/après mesures (accès non
autorisé, fuite massive, ré-identification, détournement de
finalité, erreur OCR, décision défavorable établissement, atteinte
vie privée mineur). **Mesures techniques** : TLS 1.3, PostgreSQL
chiffrée, PBKDF2, JWT, contrôle d'accès `get_owned_student`, CORS
strict, minimisation. **Mesures organisationnelles** : DPO,
registre des traitements, formation équipe, contrats art. 28,
procédure de violation à 72 h, procédure d'exercice des droits.

**Conclusion AIPD** : risques résiduels au niveau **acceptable**.

## SLA

Disponibilité 99 % en période Parcoursup (janvier-août). RPO 1 h /
RTO 4 h. P0 < 30 min de prise en charge. Post-mortem public sous
7 jours pour tout incident P0/P1.

---

# Chapitre 8 — Conduite du changement (ADKAR)

> Document source complet : [`docs/change-management.md`](../change-management.md)

## Awareness

Pourquoi Scoolize existe : l'opacité de Parcoursup, l'anxiété des
candidats, la saisie fastidieuse. Canaux de sensibilisation —
webinaires académiques, présentation en conseil de classe, kit
presse pour les CIO.

## Desire

Bénéfices clairs par segment : étudiant (chances visibles, gain de
temps), famille (compréhension), professeur (outil de dialogue
objectivé), école (candidats mieux ciblés).

## Knowledge

Kits d'onboarding étudiant (3 étapes) et école (déclaration d'une
formation). FAQ avec définitions du jargon. Vidéos courtes
intégrées aux écrans clés.

## Ability

Formation des référents pédagogiques (sessions 1 h en
établissement). Hotline et chat aux périodes clés (janvier-avril).
Validation humaine systématique des notes OCR. **Accessibilité
RGAA** : contrastes, navigation clavier, lecteurs d'écran,
alternatives textuelles.

## Reinforcement

Roadmap de **coexistence Parcoursup → Scoolize sur 2 ans** : année
0 pilote (5-10 établissements), année 1 extension académique, année
2 passerelle de données. Métriques de succès : taux d'activation,
précision algorithme sur données réelles, réduction des vœux
« hors de portée », satisfaction étudiants et référents.

---

# Chapitre 9 — Mapping des 21 compétences

> Document source complet : [`docs/06-mapping-competences.md`](../06-mapping-competences.md)

Le fichier `compétences scoolize.xlsx` (21 compétences) est mappé
ligne à ligne avec, pour chaque compétence : les **livrables et
preuves Scoolize concrètes** (avec chemins de fichiers cités), une
**auto-évaluation honnête de 1 à 5**, et une **justification**.

## Synthèse

- **Moyenne pondérée actuelle** : ≈ **3,4 / 5**.
- **Cible après production de l'intégralité des livrables** :
  ≈ **4,1 / 5**.

## Compétences les mieux couvertes (4-5)

- 01.02.B09 — Quantifier les similitudes (matching scikit-learn).
- 05.01.B02 — Prototype convaincant (MVP démontré).
- 03.01.B06 — UX ergonomique (8 routes + design system).
- 02.04.B02 — Versioning Git (commits conventionnels + transparence
  IA).
- 02.05.B02 — Vie privée / confidentialité (JWT + RGPD).

## Compétences moins bien couvertes (2)

- 02.03.B05 — Partenariats.
- 02.06.B12 — Stratégie de promotion.
- 06.04.B01 — Étude marché et concurrence.
- 06.04.B02 — Stratégies marketing et commerciales.

Toutes remontent par les livrables produits.

## Limites assumées

Collaboration équipe (historique Git à un seul contributeur réel à
ce stade), tests utilisateurs réels (à conduire), données réelles
Parcoursup (import non automatisé), compétence orale (mesurable
uniquement le jour de la soutenance).

---

# Chapitre 10 — Rétrospective

> Document source complet : [`docs/10-retrospective.md`](../10-retrospective.md)

## Reproches du jury au 1er rendu

Pas d'OCR. Prévisions imprécises. Pas de distinction sélectif/non-
sélectif. Présentation trop technique, manque de vision produit.
Constat global : *« deux semaines, trois personnes, rendu
insuffisant »*.

## Réponses du rattrapage

| Reproche | Réponse |
|----------|---------|
| Pas d'OCR | Tesseract intégré, 3/3 bulletins extraits. |
| Prévisions imprécises | Régression logistique scikit-learn + intervalle de confiance. |
| Pas de distinction sélectif / non-sélectif | Deux branches d'algorithme, badges UI distincts. |
| Manque de vision | 11 livrables non-techniques (audit, personas, mockups, charte, business, conformité, change management, tests utilisateurs, mapping, rétrospective, soutenance). |

## Leçons individuelles

Sur la **priorisation produit *vs* tech** : produire un audit
contextuel et des personas avant de coder change radicalement la
qualité du code qui suit. Sur l'**honnêteté de l'évaluation** :
assumer une note basse quand la compétence n'est pas couverte.
Sur la **présentation orale** : préparer la soutenance comme un
livrable à part entière, pas comme un *« on improvisera »*.

## Ce qu'on referait différemment

Avec un mois de plus : tests utilisateurs réels (8-10 entretiens),
imports CSV Parcoursup réels, auth école, audit RGAA, métriques
produit. Si on recommençait à zéro : commencer par la vision
(audit + personas) **avant** d'ouvrir un éditeur, et préparer la
soutenance **dès la première semaine**.

---

# Annexes

## Repo et démo

- Repo Git : *(à compléter par l'utilisateur — URL GitHub)*
- Démo en ligne : *(à compléter — URL Vercel + Render)*
- Vidéo de démo backup : *(à enregistrer avant la soutenance)*

## Documents sources (parcours rapide)

| # | Livrable | Fichier |
|---|----------|---------|
| 1 | Audit Parcoursup | `docs/01-audit-parcoursup.md` |
| 2 | Personas et journeys | `docs/02-personas-journeys.md` |
| 3 | Maquettes (design system + spec + mockups) | `docs/03-maquettes/` |
| 4 | Identité visuelle | `docs/04-identite-visuelle/` |
| 5 | Business model | `docs/05-business-model.md` |
| 6 | Mapping compétences | `docs/06-mapping-competences.md` |
| 7 | Conformité RGPD | `docs/07-conformite/` |
| 8 | Tests utilisateurs | `docs/08-tests-utilisateurs/` |
| 9 | Dossier projet (ce document) | `docs/09-dossier-projet/` |
| 10 | Rétrospective | `docs/10-retrospective.md` |
| 11 | Soutenance (pitch + plan + démo + QA + cheatsheet) | `docs/11-soutenance/` |
| — | Change management ADKAR | `docs/change-management.md` |
| — | Déploiement (Vercel + Render + CI) | `docs/deployment.md` |
| — | Slides de soutenance | `docs/slides/slides.md` |
| — | Script de démo (version courte) | `docs/demo-script.md` |
| — | Captures d'écran | `docs/screenshots/` |

## Équipe

| Membre | Rôle |
|--------|------|
| Paul-Adrien Desplechin | Backend, OCR, algo de matching, intégration |
| Hugo | Frontend Predict (parcours étudiant) |
| Nino | Frontend Prepare (parcours école) |

## Licence

Code source sous licence **MIT** (voir `LICENSE` à la racine du
dépôt).
