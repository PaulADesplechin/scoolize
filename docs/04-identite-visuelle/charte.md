# Charte graphique — Scoolize

## Manifeste de marque

Scoolize est une plateforme d'orientation post-bac qui rend lisibles
les chances réelles d'admission. **Pour qui** : lycéens, parents,
conseillers d'orientation, équipes d'admissions des établissements.
**Pourquoi** : parce que Parcoursup affiche des taux historiques mais
ne dit à personne, individuellement, *« est-ce que tu as une chance ? »*.

## Personnalité de marque

| Adjectif | Ce qu'il implique en design et en copy |
|----------|----------------------------------------|
| **Clair** | Hiérarchie typographique forte, beaucoup de blanc, une seule action principale par écran. |
| **Sérieux** | Bleu institutionnel plutôt que violet branché ; pas d'illustrations cartoon. |
| **Accessible** | Vocabulaire simple, pas d'acronyme non explicité, contrastes WCAG AA. |
| **Honnête** | Toujours afficher l'intervalle de confiance et la source du chiffre. |
| **Optimiste** | Tonalité orientée action et possible ; éviter le registre anxiogène. |

## Ton de voix

### À faire

- Phrases courtes, factuelles. Une idée par phrase.
- Donner un **chiffre** puis l'expliquer en une ligne.
  > *« 28 % de chances estimées — moyenne 17,3/20 sur les matières clés, seuil indicatif 16,5. »*
- Tutoyer le candidat (registre conversationnel, pas familier).
- Préférer le verbe à l'abstraction : *« importer son bulletin »* plutôt que *« procéder au téléversement du document de notation ».*

### À ne pas faire

- **Pas de jargon Parcoursup non expliqué** (« attendus », « CEV »,
  « sous-vœux ») sans définition à l'usage.
- **Pas de promesses irréalistes** (« garantissez votre admission »,
  « le meilleur choix pour vous »). Le score est une estimation, pas
  une garantie.
- **Pas d'emojis** dans le produit ni dans les documents officiels.
- **Pas de superlatifs marketing** (« la meilleure plateforme »,
  « révolutionnaire »).

## Palette de couleurs

| Token | Hex | Usage | Justification |
|-------|-----|-------|---------------|
| `primary` | `#4263eb` | Boutons principaux, liens, focus ring | Bleu institutionnel — registre confiance, transparence (cf. Sciences Po, MIT). |
| `primary-foreground` | `#ffffff` | Texte sur fond `primary` | Contraste 6.8:1, WCAG AA+. |
| `background` (light) | `#ffffff` | Fond principal | Maximise la lisibilité. |
| `background` (dark) | `#0a0a0a` | Mode sombre | Réservé à un usage futur, non par défaut. |
| `foreground` | `#0a0a0a` / `#fafafa` | Texte principal | — |
| `muted` | `#f4f4f5` | Cartes secondaires, en-têtes tableaux | Neutre chaud. |
| `muted-foreground` | `#71717a` | Texte secondaire | — |
| `border` | `#e4e4e7` | Séparations | Discret. |
| `success` | `#16a34a` | Confirmation, score ≥ 70 | Vert calme, pas fluo. |
| `warning` | `#d97706` | Vigilance, score entre 45 et 70 | Ambré, pas orange agressif. |
| `destructive` | `#dc2626` | Erreur, score < 45 | Rouge réservé aux destructions et alertes. |
| `chart-1` | `#4263eb` | Bleu primary | Cohérence brand. |
| `chart-2` | `#16a34a` | Vert | — |
| `chart-3` | `#d97706` | Ambre | — |
| `chart-4` | `#dc2626` | Rouge | — |
| `chart-5` | `#9333ea` | Violet | Variation. |

**Règle de combinaison**

- Le `primary` n'est utilisé que pour **l'action principale** d'un écran
  (CTA, lien actif). Jamais comme fond d'une zone passive.
- Le `destructive` n'est utilisé que pour des actions destructrices ou
  des erreurs réelles. Pas pour signaler « score faible » côté étudiant
  (préférer une teinte plus neutre — un score faible est une information,
  pas une erreur).

## Typographies

| Rôle | Famille | Justification |
|------|---------|---------------|
| Titres et corps | **Inter**, `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, sans-serif | Inter est optimisée pour les chiffres, très lisible aux petites tailles, libre de droits, et présente nativement sur tous les OS modernes via les fallbacks. |
| Code et nombres techniques | **Geist Mono**, `ui-monospace`, `SFMono-Regular`, `Menlo`, monospace | Différenciation visuelle des chiffres techniques (notes, codes UAI, IDs). |

### Tailles (web)

| Token | Taille | Usage |
|-------|--------|-------|
| H1 | 2.25rem / 36 px | Titres de page (« Vos formations, Léa »). |
| H2 | 1.875rem / 30 px | Sections (« Comparatif des scores »). |
| H3 | 1.5rem / 24 px | Sous-sections. |
| Body | 1rem / 16 px | Texte courant. |
| Small | 0.875rem / 14 px | Aide contextuelle, légendes. |
| Tiny | 0.75rem / 12 px | Métadonnées (intervalle de confiance, etc.). |

**Réglages typographiques**

- Headings : `font-weight: 700`, `letter-spacing: -0.02em`.
- Body : `font-weight: 400-500`, `line-height: 1.5`.

## Iconographie

Bibliothèque [**Lucide**](https://lucide.dev) (déjà utilisée dans le
produit Next.js). Style : linéaire, stroke 1.5 px, 24 px par défaut,
16 px en inline. **Une seule bibliothèque** : pas de mélange Heroicons
+ Lucide + Font Awesome.

## Logo

### Concept

Une **toque universitaire** (*mortarboard*) stylisée en bleu Scoolize.
Le symbole évoque l'enseignement supérieur — point d'arrivée du
parcours d'orientation — sans s'enfermer dans un registre élitiste.
Le glaucope simplifié à 4 sommets (losange) reste lisible à toutes les
tailles. Une pampille (*tassel*) sous la toque marque l'aboutissement.

### Variantes

| Fichier | Usage |
|---------|-------|
| [`logo.svg`](logo.svg) | Version complète (symbole + *wordmark*), à utiliser sur fond clair. |
| [`logo-mark.svg`](logo-mark.svg) | Symbole seul, pour favicon, avatar, vidéo, image OG. |
| [`logo-white.svg`](logo-white.svg) | Version complète en blanc, pour fond bleu primary ou photo sombre. |
| [`favicon.svg`](favicon.svg) | Favicon 32×32 avec fond bleu et toque blanche. |

### Règles d'usage

- **Espace de protection** : au moins la hauteur de la toque sur chaque
  côté du logo.
- **Tailles minimales** : logo complet à **120 px** de largeur ;
  symbole seul à **16 px** (taille favicon).
- **Fonds autorisés** : blanc, `muted` (#f4f4f5), `primary` (#4263eb —
  utiliser la variante blanche). Photo nette à faible bruit visuel
  uniquement, jamais devant un texte.
- **Interdit** : rotation, distorsion, modification des couleurs,
  ajout d'ombre portée ou de relief, logo placé sur photo bruitée
  ou sur dégradé.

### Note technique

Le *wordmark* dans `logo.svg` utilise une famille système (`Inter`
en priorité, fallbacks `system-ui`/`Segoe UI`/`Roboto`). Pour des
rendus *print* (PDF haute définition, plaquette), il est recommandé
de convertir le texte en chemins SVG pour garantir l'apparence quel
que soit l'environnement.

## Accessibilité

- **Contraste** : WCAG AA minimum. Le bleu `primary` sur blanc
  atteint un ratio de 6.0:1 ; le `foreground` sur `background` atteint
  21:1.
- **Focus** : ring 3 px à 50 % d'opacité de la couleur `ring` (≈ `primary`).
  Visible sur tous les éléments interactifs.
- **Tailles tap mobile** : 44×44 px minimum pour les éléments
  interactifs (boutons, icônes cliquables).
- **Alt text** : systématique sur les images significatives. Les
  icônes décoratives sont marquées `aria-hidden`.
- **Sémantique** : utiliser les balises HTML adaptées (`<button>`,
  `<a>`, `<table>`, `<label>`). Éviter les `<div>` cliquables.
