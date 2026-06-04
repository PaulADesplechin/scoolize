# Rétrospective du rattrapage — Scoolize

> Document court (1-2 pages) destiné à clore le projet en assumant le
> chemin. Pas victimaire, pas servile : honnête.

> Les sections marquées **`[À COMPLÉTER]`** demandent ton vécu réel —
> Hugo, Nino, votre dynamique d'équipe pendant le 1er rendu. C'est
> ces 4-5 phrases qui rendront la rétro **authentique** plutôt que
> générique.

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

`[À COMPLÉTER — ce qui s'est réellement passé pendant les deux
premières semaines. Quelques pistes possibles à valider ou écarter :]`

- **Sous-estimation du scope** — on a commencé par le frontend et le
  catalogue de formations sans avoir cadré la vision produit.
- **Priorisation déséquilibrée** — beaucoup d'énergie investie sur
  des features visuelles (filtres, UI), peu sur les fondations
  (algorithme, OCR, vision).
- **Découpage d'équipe flou** — `[ÀCOMPLÉTER : qui a fait quoi
  pendant le 1er rendu, comment vous vous êtes répartis le travail à 3,
  est-ce qu'il y a eu des moments où vous n'étiez pas alignés ?]`
- **Pas de tests utilisateurs** — on a construit ce qu'on imaginait
  utile sans vérifier.
- **Documentation absente** — le code parlait, mais aucun document
  produit ne contextualisait la démarche.

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

`[À COMPLÉTER — ce que tu as fait différemment côté méthode]`

Quelques pistes plausibles :
- Découpage rôles explicite (toi backend/algo, Hugo Predict UI, Nino
  Prepare UI) — visible dans le repo via les branches dédiées.
- Cadence resserrée : un point d'avancement quotidien, livrables
  documentés à chaque étape.
- Préparation soutenance dès la 2ᵉ semaine de rattrapage, pas en
  dernière minute.

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

`[À COMPLÉTER — ce que vous avez appris sur la communication
intra-équipe pendant le rattrapage : ce qui a marché, ce qui a moins
marché, ce que vous emporteriez dans un futur projet]`

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
- **À l'équipe** — `[À COMPLÉTER — quelques lignes sur Hugo et
  Nino, ce que vous avez traversé ensemble, ce que tu retiens du
  collectif]`.
- **Aux participants** — qui ont accepté de partager 20 minutes de
  leur vécu Parcoursup pour qu'on construise quelque chose qui leur
  parle.

---

> *Le code est un moyen ; la vision est le projet.*
