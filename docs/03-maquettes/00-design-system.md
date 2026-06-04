# Design system — Scoolize

Document de référence des **composants atomiques** et des **patterns**
utilisés dans Scoolize. Pour la palette, la typographie et la charte
de marque, voir [`../04-identite-visuelle/charte.md`](../04-identite-visuelle/charte.md).

---

## Échelle d'espacement

Scoolize utilise une échelle Tailwind/8 px standard. Les
valeurs entre crochets correspondent aux *gaps* ou *padding* internes.

| Token | px | Usage typique |
|-------|---:|---------------|
| `space-0` | 0 | — |
| `space-1` | 4 | Espacement intra-composant (icône↔label). |
| `space-2` | 8 | Inputs internes, gap items. |
| `space-3` | 12 | Cards intérieures. |
| `space-4` | 16 | Card padding standard, gap entre champs. |
| `space-6` | 24 | Sections internes. |
| `space-8` | 32 | Entre sections. |
| `space-12` | 48 | Marges verticales de page. |
| `space-16` | 64 | Hero, séparation majeure. |

## Border-radius

| Token | px | Usage |
|-------|---:|-------|
| `rounded-md` | 6 | Boutons compacts. |
| `rounded-lg` | 8 | Cards, inputs, boutons. |
| `rounded-xl` | 12 | Cards principales. |
| `rounded-full` | ∞ | Badges, avatars, ronds (jauge). |

## Composants atomiques

### Button

| Variante | Apparence | Usage |
|----------|-----------|-------|
| `primary` | Fond `primary`, texte blanc | Action principale de la vue (≤ 1 par écran). |
| `secondary` | Fond `muted`, texte foreground | Action alternative au même rang. |
| `outline` | Bord `border`, fond transparent | Action secondaire / annulation. |
| `ghost` | Fond transparent, hover `muted` | Action discrète (icône, nav). |
| `destructive` | Fond `destructive/10`, texte `destructive` | Suppression. |

**Tailles** : `sm` (h-7), `default` (h-9), `lg` (h-10).
**États** : default, hover, focus (ring 3 px primary/50), active, disabled (opacity 0.5).

### Input

| État | Visuel |
|------|--------|
| Default | Bord `border`, fond transparent. |
| Focus | Bord `primary`, ring 3 px `primary/30`. |
| Erreur | Bord `destructive`, ring `destructive/20`, message *destructive* sous le champ. |
| Disabled | Fond `muted`, opacity 0.5. |

Hauteur `h-9` (36 px). Padding inline 12 px.

### Select natif

Même apparence que `Input`. Utilisation d'un `<select>` natif pour la
fiabilité multi-navigateur (cf. décision documentée dans
[`../../frontend/src/lib/utils.ts`](../../frontend/src/lib/utils.ts)).

### Card

- Padding interne 16–24 px selon densité.
- Bord `border`, fond `background`.
- `rounded-xl` par défaut.
- Header optionnel (titre + description) ; corps ; footer optionnel.

### Badge

| Variante | Apparence | Usage |
|----------|-----------|-------|
| `default` | Fond `primary`, texte blanc | Sélective. |
| `secondary` | Fond `muted`, texte foreground | Non-sélective. |
| `outline` | Bord `border`, texte foreground | Éligible. |
| `destructive` | Fond `destructive/10`, texte `destructive` | Sous le seuil. |

Taille fixe h-5, padding 0 8 px, `rounded-full`.

### Tag (filtre actif)

Forme `rounded-full`, padding 4 12 px, fond `muted`, croix de
suppression à droite. Utilisé sur la page résultats Predict.

### Avatar

Cercle 32 ou 40 px, initiales sur fond `primary/15` + texte
`primary`. Pas de photo réelle dans Scoolize.

### Modal

Centré, overlay `bg-black/40`, largeur 480 px max, padding 24 px.
Action principale en bas à droite ; bouton fermer en haut à droite.

### Toast (sonner)

Position `top-center`, durée 4 s, icône à gauche selon type
(success/info/warning/error). Voir
[`../../frontend/src/components/ui/sonner.tsx`](../../frontend/src/components/ui/sonner.tsx).

### Table

- En-tête `bg-muted/50`, padding vertical 8 px.
- Lignes avec border-bottom `border`, hover `bg-muted/40`.
- Cellule numérique → alignée à droite.
- Cellule badge → alignement vertical centre.

### Skeleton

Rectangle `bg-muted` avec animation `animate-pulse`. Tailles
standard : `h-4` (texte), `h-8` (chiffre), `h-16` (card row),
`h-28` (résultat).

### ScoreGauge (composant Scoolize-spécifique)

Cercle SVG 72 px par défaut, stroke 6 px. Couleur du tier
(`good`/`warn`/`bad`) via `scoreTier()` :

| Tier | Seuil | Hex | Classe |
|------|-------|-----|--------|
| `good` | ≥ 70 | `#16a34a` | `text-chart-2` |
| `warn` | ≥ 45 | `#d97706` | `text-chart-3` |
| `bad` | < 45 | `#dc2626` | `text-chart-4` |

Voir [`../../frontend/src/components/score-gauge.tsx`](../../frontend/src/components/score-gauge.tsx).

### Drag-and-drop zone (Predict / upload)

Cadre `border-2 border-dashed`, hover et drag-over passent à
`border-primary bg-primary/5`. Icône cloud central, label « Déposez
votre bulletin ici » + sous-label « ou cliquez pour parcourir ».
Hauteur min 200 px.

---

## Patterns

### Formulaire

- Une colonne sur mobile, 2 colonnes max sur desktop (`sm:grid-cols-2`).
- Label au-dessus du champ.
- Aide contextuelle en `text-xs text-muted-foreground` sous le label.
- Boutons en bas, justifiés à droite (`justify-end`), action principale
  en dernier.

### Liste + filtre

- Filtres en haut (selects natifs, max 3 visibles).
- État vide explicite avec CTA.
- État chargement avec skeletons (3 à 5 placeholders).
- État erreur avec `<ErrorBanner>`.

### Hero (landing)

- Centré, max-w 3xl.
- Pré-titre badge (« L'orientation post-bac, enfin lisible »).
- Titre `text-balance`, ~36–48 px.
- Sous-titre `text-lg text-muted-foreground`.
- Deux CTA (primary + outline).

### Carte formation (résultat)

- Layout horizontal : `ScoreGauge` à gauche, contenu à droite (titre +
  badges + institution + lieu + explication + intervalle + CTA).
- `Card` simple, padding 16 px.

---

## Iconographie

Lucide React. Stroke 1.5 px, 16 px en inline, 24 px par défaut, 32 px
en hero. Liste utilisée dans le produit :

- `GraduationCap` (marque)
- `Layers`, `Sparkles`, `Users` (stats Prepare)
- `ScanText`, `Gauge`, `FileText`, `UploadCloud` (Predict)
- `Plus`, `Trash2`, `ArrowRight`, `ArrowLeft` (actions)
- `Check`, `MapPin` (statuts, contexte)
- `Download` (export CSV)
- `RotateCcw` (reset)

## Responsive

- **Mobile-first** : tout est conçu pour 375 px de large minimum.
- **Breakpoints Tailwind** :
  - `sm` 640 px (formulaires 2 colonnes).
  - `md` 768 px (grids 2-3 colonnes).
  - `lg` 1024 px (grids 4 colonnes, sidebar Prepare).
  - `xl` 1280 px (max-w global du contenu).

## Accessibilité

- Contrastes WCAG AA pour tout texte sur fond.
- Focus visible sur tous les éléments interactifs (ring 3 px).
- Cibles tap ≥ 44×44 px sur mobile.
- Navigation clavier complète (tab order logique, escape ferme les modals).
- `aria-label` sur les icônes seules ; `aria-hidden="true"` sur les
  icônes décoratives à côté d'un texte.
