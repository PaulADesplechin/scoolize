# Spec des écrans — Scoolize

Spec textuelle pour chaque écran de l'application. Chaque spec est
accompagnée d'un mockup HTML autonome dans
[`mockups/`](mockups/) qui sert de référence visuelle (à reproduire
dans Figma, ou à importer via le plugin *HTML to Figma*).

| Lettre | Écran | Mockup | Persona principal |
|:------:|-------|--------|-------------------|
| A | Landing Scoolize | [`mockups/A-landing.html`](mockups/A-landing.html) | Tous |
| B | Predict — Profil étudiant | [`mockups/B-predict-home.html`](mockups/B-predict-home.html) | Léa, Maxime, Aïcha |
| C | Predict — Upload bulletin | [`mockups/C-predict-upload.html`](mockups/C-predict-upload.html) | Tous étudiants |
| D | Predict — Édition des notes | [`mockups/D-predict-grades.html`](mockups/D-predict-grades.html) | Tous étudiants |
| E | Predict — Résultats | [`mockups/E-predict-results.html`](mockups/E-predict-results.html) | Léa surtout |
| F | Predict — Détail formation | [`mockups/F-predict-detail.html`](mockups/F-predict-detail.html) | Aïcha, Maxime |
| G | Prepare — Tableau de bord | [`mockups/G-prepare-home.html`](mockups/G-prepare-home.html) | Mme Bernard |
| H | Prepare — Nouvelle formation | [`mockups/H-prepare-new-program.html`](mockups/H-prepare-new-program.html) | Mme Bernard, M. Lavigne |
| I | Prepare — Liste candidats | [`mockups/I-prepare-candidates.html`](mockups/I-prepare-candidates.html) | Mme Bernard |
| J | Prepare — Détail candidat | [`mockups/J-prepare-candidate-detail.html`](mockups/J-prepare-candidate-detail.html) | Mme Bernard |

---

## A. Landing Scoolize

**Objectif** — convertir un visiteur en utilisateur, expliquer la
proposition de valeur en moins de 10 secondes, orienter vers le bon
parcours (Predict ou Prepare).

**Persona cible** — tout visiteur (étudiant, parent, école, journaliste).

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ [Logo Scoolize]            Accueil  Prepare   Predict    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│              [ Badge "L'orientation enfin lisible" ]     │
│                                                          │
│            Scoolize rend Parcoursup CLAIR.               │
│                                                          │
│   Uploadez votre bulletin, laissez l'OCR lire vos notes  │
│   et découvrez les formations qui matchent.              │
│                                                          │
│            [ Je suis étudiant ]  [ Je suis une école ]   │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [ Card Predict — étudiant ]   [ Card Prepare — école ]  │
├──────────────────────────────────────────────────────────┤
│                  Pourquoi Scoolize ?                     │
│  [ Carte 1 OCR ]  [ Carte 2 Matching ]  [ Carte 3 Sel ]  │
└──────────────────────────────────────────────────────────┘
```

**Composants** — `SiteHeader`, hero (`Badge` + h1 + subtitle + 2 `Button`),
2 `Card` produit, grille 3 `Card` *features*, footer minimaliste.

**Comportements** — scroll fluide, hover sur les CTAs (translation 2 px),
liens dans le header actifs selon route. Pas d'animation lourde.

**États** — pas d'état dynamique. Page statique.

---

## B. Predict — Profil étudiant

**Objectif** — créer le compte étudiant en moins de 60 secondes (5
champs + lycée).

**Persona cible** — Léa, Maxime, Aïcha.

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ Header                                                   │
├──────────────────────────────────────────────────────────┤
│                  [ Icône GraduationCap ]                 │
│              Créez votre profil étudiant                 │
│              Quelques infos pour démarrer.               │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Mon profil                                         │  │
│  │ ────────                                           │  │
│  │ [Prénom ▭]   [Nom ▭]                              │  │
│  │ [Email                              ▭]            │  │
│  │ [Mot de passe (≥ 6)                 ▭]            │  │
│  │ [Lycée (select)                     ▼]            │  │
│  │ [Filière / spécialités              ▭]            │  │
│  │                                                    │  │
│  │          [ Créer mon profil et continuer ]         │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Composants** — `Card` formulaire, `Input` × 4, `Label` × 6,
`<select>` × 1 (lycée), `Button primary` plein largeur.

**Comportements** — soumission désactive le bouton et affiche
« Création… » ; *toast success* à la création ; redirige vers Upload.
Si étudiant déjà en `localStorage`, affiche un *welcome back* avec
deux boutons (Analyser un bulletin / Voir mes formations) + ghost
*Changer de profil*.

**États** — *loading* (bouton désactivé), *erreur* (toast destructive),
*déjà connecté* (variante welcome).

---

## C. Predict — Upload bulletin

**Objectif** — déposer un PDF de bulletin et lancer l'OCR.

**Persona cible** — tous les étudiants. Critique pour Maxime et Aïcha
(point de bascule émotionnel).

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ Header                                                   │
├──────────────────────────────────────────────────────────┤
│              Importez votre bulletin                     │
│      Format PDF. L'OCR lit vos notes ; vous validez.     │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Bulletin PDF                                         ││
│  │ ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ ││
│  │ │             [ Icône cloud ]                     │ ││
│  │ │       Déposez votre bulletin ici                │ ││
│  │ │       ou cliquez pour parcourir                 │ ││
│  │ └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ ││
│  │                                                      ││
│  │  Saisir mes notes à la main      Analyser le bulletin││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Composants** — `Card`, zone drag-and-drop, `Input file` caché,
`Button ghost` (saisie manuelle), `Button primary` (analyser).

**Comportements** — `drag-over` change la couleur de bordure
(`border-primary bg-primary/5`) ; *drop* d'un PDF non-PDF affiche un
toast d'erreur ; `Analyser` désactive le bouton avec spinner.

**États** — vide (cloud icon), avec fichier sélectionné (filename +
taille), *loading* (spinner), erreur (toast destructive).

---

## D. Predict — Édition des notes

**Objectif** — valider/corriger les notes extraites par l'OCR avant
matching.

**Persona cible** — tous étudiants.

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ Header                                                   │
├──────────────────────────────────────────────────────────┤
│              Vérifiez vos notes                          │
│      Notes extraites par OCR — corrigez si besoin.       │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Mes moyennes                                         ││
│  │ ───────────                                          ││
│  │ [Mathématiques ▼]    [ 18,0 ]    [ 🗑️ ]              ││
│  │ [Physique-Chimie ▼]  [ 17,0 ]    [ 🗑️ ]              ││
│  │ [NSI ▼]              [ 16,5 ]    [ 🗑️ ]              ││
│  │ ...                                                  ││
│  │ [ + Ajouter une matière ]                            ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│              [ Valider et voir mes formations → ]        │
└──────────────────────────────────────────────────────────┘
```

**Composants** — `Card`, lignes répétées (`<select>` + `Input number`
+ `Button ghost icon`), `Button outline` (ajouter), `Button primary`
(valider).

**Comportements** — édition inline ; suppression ligne avec confirmation
implicite (suppression directe, possible undo via toast) ; validation
appelle l'API.

**États** — vide initial (1 ligne par défaut), avec OCR (n lignes
pré-remplies, label différent dans le subtitle), validation en cours,
erreur API.

---

## E. Predict — Résultats

**Objectif** — top 10 de formations, comparatif, filtres, candidature.

**Persona cible** — Léa surtout ; les autres bénéficient.

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ Header                                                   │
├──────────────────────────────────────────────────────────┤
│ Vos formations, Léa                                      │
│ Classées par adéquation et probabilité d'admission.      │
│                                                          │
│ [Type ▼]   [Région ▼]                                    │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Comparatif des scores  (bar chart horizontal)        ││
│  │ BUT GEII        ████████████████████████████ 94      ││
│  │ Bachelor ECE    ███████████████████████████ 93       ││
│  │ BUT Info        ██████████████████████████ 92        ││
│  │ ...                                                  ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ [Jauge 94]  BUT GEII  [Sélective] [Éligible]         ││
│  │             IUT de Cachan · Île-de-France            ││
│  │             Probabilité d'admission 89 % — moy 17,2  ││
│  │             Intervalle 88,2 – 96,2                   ││
│  │             [ Candidater ]                           ││
│  └──────────────────────────────────────────────────────┘│
│  [ ... 9 autres cartes ... ]                             │
└──────────────────────────────────────────────────────────┘
```

**Composants** — 2 `<select>` (filtre type, filtre région),
`Card` avec `Recharts BarChart` horizontal, n × `ProgramCard` avec
`ScoreGauge`, `Badge`, `Button`.

**Comportements** — filtre client side, animation jauge,
`Candidater` désactive (Loader → Check), *toast success*.

**États** — loading (4 skeletons), résultats vides (texte +
suggestion ajouter notes), erreur (`<ErrorBanner>`), filtre sans
résultat (texte explicatif).

---

## F. Predict — Détail formation

**Objectif** — comprendre en profondeur **pourquoi** cette formation
matche, voir les détails (calendrier, témoignages, taux d'admission
historiques).

**Persona cible** — Aïcha, Maxime (besoin d'explications).

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ [← Retour]  CPGE MPSI — Lycée Louis-le-Grand             │
├──────────────────────────────────────────────────────────┤
│ [Jauge XL 28]  Probabilité 28 % — sous le seuil          │
│                Moy. matières clés 17,3/20 (seuil 16,5)   │
│                                                          │
│ ─── Pourquoi ce score ? ───                              │
│ • Mathématiques     17,5    poids 0,5    contrib +43%    │
│ • Physique-Chimie   17,0    poids 0,3    contrib +25%    │
│ • NSI               16,5    poids 0,2    contrib +16%    │
│                                                          │
│ ─── À propos de la formation ───                         │
│ Capacité : 144 places · Taux historique : 8 %            │
│ Région : Île-de-France · Domaine : Sciences              │
│                                                          │
│ [ Candidater ]   [ Voir les candidats similaires ]       │
└──────────────────────────────────────────────────────────┘
```

**Composants** — header avec back, jauge XL (size 120), tableau
décomposition, métadonnées, CTAs.

**Comportements** — clic candidater → modal confirmation, clic
voir similaires → modal liste.

**États** — chargement (skeleton), introuvable (404), erreur (banner).

---

## G. Prepare — Tableau de bord

**Objectif** — vue d'ensemble d'une école : formations, candidatures.

**Persona cible** — Mme Bernard, M. Lavigne.

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ Header                                                   │
├──────────────────────────────────────────────────────────┤
│ Tableau de bord école                                    │
│ Gérez vos formations et suivez vos candidats.            │
│ [ Candidats ]    [ + Nouvelle formation ]                │
│                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐ │
│ │Formations  │ │Sélectives  │ │Non-sélect. │ │Candid.  │ │
│ │     50     │ │     28     │ │     22     │ │    1    │ │
│ └────────────┘ └────────────┘ └────────────┘ └─────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Formations déclarées                                 ││
│ │ ────────────────────                                 ││
│ │ CPGE MPSI [Sélective] · LLG · Paris                  ││
│ │   144 places · 8% admis                              ││
│ │ ...                                                  ││
│ └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Composants** — 4 `Card stat`, liste de `Card row` formation.

**Comportements** — clic formation → édition (future) ; clic
*Candidats* → page I ; *Nouvelle formation* → page H.

**États** — chargement (skeletons), vide (CTA créer première), erreur
(`<ErrorBanner>`).

---

## H. Prepare — Nouvelle formation

**Objectif** — déclarer une formation avec critères, matières clés,
capacité.

**Persona cible** — Mme Bernard, M. Lavigne.

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ [← Retour au tableau de bord]                            │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ Nouvelle formation                                   ││
│  │ Critères et matières clés pour le matching.          ││
│  │                                                      ││
│  │ [Intitulé* ▭]                                        ││
│  │ [Établissement* ▭]                                   ││
│  │ [Type ▼]      [Domaine ▼]                            ││
│  │ [Ville ▭]     [Région ▼]                             ││
│  │ [Capacité ▭]  [Taux d'admission % ▭]                 ││
│  │ [Moyenne min /20 ▭] (si sélective)                   ││
│  │                                                      ││
│  │ Matières clés (pondérées)         [ + Ajouter ]      ││
│  │ [Mathématiques ▼] [ 0.5 ]  [🗑️]                      ││
│  │ ...                                                  ││
│  │                                                      ││
│  │              [ Annuler ]  [ Créer la formation ]     ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Composants** — `Card`, formulaire 1-2 colonnes, lignes répétées
matières clés.

**Comportements** — *moyenne min* affichée seulement si type
sélective ; aide « les poids n'ont pas besoin de sommer à 1 » ;
validation côté client.

**États** — vide initial, validation, succès (redirect tableau de
bord + toast), erreur (toast).

---

## I. Prepare — Liste candidats

**Objectif** — voir les candidats matchés (filtres + export).

**Persona cible** — Mme Bernard.

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ [← Retour au tableau de bord]                            │
│ Candidats                                                │
│ Étudiants ayant candidaté, classés par score.            │
│                                  [ ⬇ Exporter en CSV ]   │
│                                                          │
│ Filtrer par formation [ Toutes les formations ▼ ]        │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ 1 candidature                                        ││
│  │ Le score est figé au moment de la candidature.       ││
│  │                                                      ││
│  │ Candidat │ Lycée    │ Formation  │ Type │   Score   ││
│  │ ─────────┼──────────┼────────────┼──────┼──────────  ││
│  │ E2E Test │ ...      │ BUT GEII   │ Sél. │     94,2   ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Composants** — back link, header + `Button outline` (export),
`<select>` filtre, `Card` + `Table`.

**Comportements** — filtre par formation côté API (requête à chaque
changement) ; export CSV côté client (Blob, BOM UTF-8) ; clic ligne
→ page J.

**États** — chargement (5 skeletons), filtre sans résultat (texte),
erreur (`<ErrorBanner>`).

---

## J. Prepare — Détail candidat

**Objectif** — examiner en profondeur le dossier d'un candidat
(notes, lycée, score, motivation).

**Persona cible** — Mme Bernard, M. Lavigne.

**Wireframe**

```
┌──────────────────────────────────────────────────────────┐
│ [← Retour aux candidats]                                 │
│ Léa MARTIN                                               │
│ Lycée Louis-le-Grand · Terminale Générale spé Maths PC   │
│                                                          │
│ ┌──────────────────────────┐ ┌────────────────────────┐  │
│ │ Score sur cette formation│ │ Notes                  │  │
│ │   [Jauge XL 94]          │ │ Mathématiques 18.0     │  │
│ │   Probabilité 89 %       │ │ Physique-Chimie 17.0   │  │
│ │   IC 88,2 – 96,2         │ │ NSI 16.5               │  │
│ │   Éligible               │ │ ...                    │  │
│ └──────────────────────────┘ └────────────────────────┘  │
│                                                          │
│ ─── Détail du calcul ───                                 │
│ • Affinité matières clés : 17,5/20  →  +43%              │
│ • Marge au seuil          : +1,8     →  +25%             │
│ • Géo (même région)       : 1,0      →  +10%             │
│ • Sélectivité formation    : 0,92    →  −5%              │
│                                                          │
│ [ Marquer comme accepté ]  [ Marquer comme refusé ]      │
└──────────────────────────────────────────────────────────┘
```

**Composants** — header back + identité, 2 `Card` (score+jauge / notes),
tableau décomposition, `Button` actions.

**Comportements** — actions optionnelles (statut interne) ; export
PDF individuel (future).

**États** — chargement, candidat introuvable (404), accès refusé.
