# Scoolize — Frontend (Next.js 14)

Application à deux faces : **Predict** (étudiant) et **Prepare** (école).

## Pré-requis

- Node.js 18+
- Le backend lancé sur `http://localhost:8000` (voir `../backend`).

## Lancement

```bash
npm install
npm run dev        # http://localhost:3000
```

L'URL de l'API est lue depuis `NEXT_PUBLIC_API_URL` (défaut `http://localhost:8000`).
Copiez `.env.example` en `.env.local` pour la personnaliser.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (composants basés sur Base UI)
- **Recharts** pour les graphiques

## Structure

```
src/
  app/
    page.tsx              # landing
    predict/              # parcours étudiant (profil, upload, notes, résultats)
    prepare/              # parcours école (dashboard, formation, candidats)
  components/
    site-header.tsx
    program-card.tsx      # carte formation + candidature
    score-gauge.tsx       # jauge de score (SVG)
    ui/                   # composants shadcn/ui
  lib/
    api.ts                # client API typé + session (token)
    constants.ts          # régions, matières, domaines
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing, présentation des deux faces |
| `/predict` | Création de profil étudiant |
| `/predict/upload` | Upload du bulletin PDF (OCR) |
| `/predict/grades` | Validation / édition des notes |
| `/predict/results` | Top formations, graphique, candidature |
| `/prepare` | Tableau de bord école |
| `/prepare/new-program` | Création d'une formation |
| `/prepare/candidates` | Candidats matchés + export CSV |
