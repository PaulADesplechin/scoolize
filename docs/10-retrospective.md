# Rétrospective du rattrapage — Scoolize

> Document court (1-2 pages) destiné à clore le projet en assumant le
> chemin. Pas victimaire, pas servile : honnête.

> Cette rétro est rédigée dans une version **neutre et factuelle**,
> défendable telle quelle. Les passages sur la dynamique d'équipe
> restent volontairement génériques : si tu veux les rendre plus
> personnels (anecdotes précises du 1er rendu, ressenti collectif),
> tu peux les enrichir — mais rien n'est inventé ici.

---

## 1. Ce qui n'a pas fonctionné lors du 1er rendu

Le rendu initial du projet a été jugé **insuffisant** par le jury,
pour quatre raisons explicites :

1. **Pas d'OCR** — la saisie manuelle des notes restait à la charge
   de l'étudiant, ce qui contredisait la promesse de produit.
2. **Prévisions imprécises** — l'estimation des chances d'admission
   reposait sur une logique trop simpliste, sans intervalle de
   confiance ni distinction par type de formation.
3. **Pas de distinction formations sélectives / non-sélectives** —
   les deux logiques d'admission, pourtant radicalement différentes
   dans Parcoursup, étaient traitées de manière indifférenciée.
4. **Présentation très technique, manque de vision produit** — le
   travail accordait une grande place au code, peu à la justification
   produit (audit Parcoursup, personas, business model, conduite du
   changement).

Le jury a également relevé : *« Le projet dure deux semaines, vous
étiez 3 sur le projet, et le rendu est clairement insuffisant. »* —
remarque que nous prenons au sérieux et qui structure les sections
suivantes.

### Nos causes racines (assumées)

En revenant sur les deux premières semaines, quatre causes racines
ressortent :

- **Sous-estimation du scope** — nous avons sous-estimé le poids de
  l'OCR et de la dimension produit dans l'évaluation. L'énergie est
  allée d'abord au frontend et au catalogue de formations, avant
  d'avoir cadré la vision.
- **Priorisation déséquilibrée** — beaucoup d'effort sur des features
  visuelles (filtres, UI), trop peu sur les fondations (algorithme,
  OCR, distinction sélectif/non-sélectif).
- **Découpage des rôles laissant des zones grises** — la répartition
  initiale du travail à trois n'était pas assez explicite, ce qui a
  créé des recouvrements et des angles morts plutôt qu'une couverture
  nette des trois chantiers (backend, Predict, Prepare).
- **Pas de tests utilisateurs et documentation absente** — nous avons
  construit ce que nous imaginions utile sans le vérifier, et le code
  parlait seul, sans document produit pour contextualiser la démarche.

---

## 2. Ce qu'on a fait différemment pour le rattrapage

### Repartir de la **vision produit**, pas du code

Le rattrapage a commencé par un audit de Parcoursup
([`01-audit-parcoursup.md`](01-audit-parcoursup.md)) qui cartographie
les points de douleur réels, classés par sévérité. Puis cinq
personas et deux user journeys
([`02-personas-journeys.md`](02-personas-journeys.md)) ont permis
d'identifier **7 insights** qui ont guidé chaque décision UX qui a
suivi.

### Adresser les **quatre reproches** un par un

| Reproche jury | Réponse du rattrapage |
|---------------|------------------------|
| Pas d'OCR | OCR Tesseract intégré, extraction parfaite sur 3 bulletins de test, validation humaine systématique (`backend/ocr/`). |
| Prévisions imprécises | Algorithme de matching scikit-learn avec régression logistique, **intervalle de confiance** affiché systématiquement (`backend/matching/`). |
| Pas de distinction sélectif / non-sélectif | Deux branches d'algorithme distinctes (probabilité d'admission *vs* affinité + capacité), affichage avec **badges différenciés** côté UI. |
| Présentation trop technique, manque de vision | Audit Parcoursup, personas, business model, identité visuelle, change management ADKAR, conformité RGPD — tous livrés en plus du code. |

### Documenter pour défendre

Onze livrables non-techniques ont été produits :

- Audit Parcoursup
- Personas et user journeys
- Specs maquettes + 10 mockups HTML
- Identité visuelle (charte + logos)
- Business model (Canvas, concurrence, 3 modèles économiques, KPIs)
- Mapping des 21 compétences (auto-évaluation honnête)
- Conformité (politique de confidentialité, CGU, mentions légales, AIPD, SLA)
- Guide d'entretien tests utilisateurs
- Rétrospective (ce document)
- Pitch + Q&A + plan de soutenance + cheatsheet
- Dossier projet PDF compilé

### Méthode différente

Le rattrapage est reparti d'un cahier des charges plus clair, avec
trois changements de méthode :

- **Découpage des rôles explicite** : un périmètre par personne
  (backend/algo, frontend Predict, frontend Prepare), pour éliminer
  les zones grises du 1er rendu.
- **Cadence resserrée** : livrables documentés à chaque étape, plutôt
  qu'un gros rendu en fin de course.
- **OCR et algorithme traités en priorité**, avant le polish visuel —
  l'inverse de l'ordre initial — et préparation de la soutenance dès
  la 2ᵉ semaine, pas en dernière minute.

---

## 3. Leçons apprises individuellement

### Sur la priorisation produit *vs* tech

Le réflexe naturel d'une équipe technique est de **construire
d'abord**. Le rattrapage nous a montré que produire un audit
contextuel et des personas avant de coder change radicalement la
qualité du code. Quand l'algorithme de matching a été écrit, on
savait *exactement* ce qu'il devait restituer — un score expliqué
avec intervalle de confiance — parce que les personas l'avaient
explicité (insight n°1 : *« on veut comprendre, pas juste un score »*).

### Sur l'honnêteté de l'évaluation

Nous avons produit un mapping des 21 compétences avec
**auto-évaluation honnête**, en assumant les notes basses sur les
compétences moins bien couvertes (partenariats, stratégie marketing,
étude de marché — toutes remontées par les livrables produit). C'est
une posture qu'on n'aurait pas eue avant : assumer ce qu'on n'a pas
fait au lieu de tout pousser à 5/5.

### Sur la communication d'équipe

La leçon principale est qu'un **découpage de rôles explicite** vaut
mieux qu'une répartition implicite : quand chacun sait précisément
quel périmètre il porte (et où sont les interfaces avec les autres),
les recouvrements et les angles morts du 1er rendu disparaissent. Des
points d'avancement réguliers et un dépôt Git lisible — un commit par
brique, des messages clairs — suffisent à garder les trois chantiers
alignés sans réunion lourde. C'est ce qu'on emporterait dans un futur
projet.

### Sur la présentation orale

La soutenance a été préparée comme un livrable à part entière, pas
comme un *« on improvisera »* : pitch d'ouverture appris par cœur,
Q&A anticipées, démo scriptée, plan B et plan C en cas de problème
technique. Cette discipline n'était pas dans nos habitudes — on l'y
intégrera désormais.

---

## 4. Ce qu'on referait différemment encore

### Si on avait un mois de plus

- **Tests utilisateurs réels** : 8 à 10 entretiens avec des
  Terminale issus de filières variées, pas 3-4. La synthèse aurait
  permis d'affiner le matching et la copy.
- **Données Parcoursup réelles** : import des CSV officiels
  data.gouv.fr au lieu de datasets plausibles hand-crafted.
- **Auth côté établissement** : actuellement ouverte pour la démo,
  une vraie authentification *école* mériterait d'être posée.
- **Audit RGAA réel** : la promesse d'accessibilité du change
  management mérite une validation par un expert.
- **Métriques produit en production** : analytics minimal pour
  mesurer le taux d'activation, le NPS, le taux de candidature.

### Si on recommençait à zéro

- Commencer par **l'audit Parcoursup** et les **personas** —
  *avant* d'ouvrir un éditeur de code. Cette semaine d'investissement
  en amont fait gagner les deux semaines suivantes.
- Cadrer la **vision produit** sur une page (problème, public, deux
  faces) et la valider avec le jury **avant** d'investir une ligne
  de code.
- Préparer la **soutenance dès la première semaine** : un brouillon
  de plan, déjà répété à voix haute. Plus tôt on s'y prend, plus
  serein on est le jour J.

---

## 5. Remerciements

- **Au jury** — pour les retours **précis** et **constructifs** sur
  le 1er rendu. Sans cette honnêteté, on aurait reproduit les mêmes
  erreurs. La précision du diagnostic (pas d'OCR, pas de distinction
  sélectif/non-sélectif, pas de vision produit) a rendu le rattrapage
  réalisable dans le temps imparti.
- **À l'équipe** — pour avoir transformé un rendu jugé insuffisant en
  une reprise structurée plutôt qu'en abandon. Ce qu'on retient du
  collectif : un périmètre clair par personne et un objectif commun
  partagé suffisent à reconstruire vite et bien.
- **Aux participants** — qui ont accepté de partager 20 minutes de
  leur vécu Parcoursup pour qu'on construise quelque chose qui leur
  parle.

---

> *Le code est un moyen ; la vision est le projet.*
