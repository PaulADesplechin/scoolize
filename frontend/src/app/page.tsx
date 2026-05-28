import Link from "next/link";
import {
  FileText,
  Gauge,
  GraduationCap,
  School,
  ScanText,
  Sparkles,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: ScanText,
    title: "OCR des bulletins",
    text: "Plus de saisie manuelle : on lit vos notes directement depuis votre bulletin PDF, vous validez en un clic.",
  },
  {
    icon: Gauge,
    title: "Matching transparent",
    text: "Un score de correspondance par formation, avec intervalle de confiance et probabilité d'admission estimée.",
  },
  {
    icon: Sparkles,
    title: "Sélectif vs non-sélectif",
    text: "Deux logiques distinctes selon le type de formation — fini l'opacité sur vos chances réelles.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="space-y-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          L&apos;orientation post-bac, enfin lisible
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Scoolize rend Parcoursup <span className="text-primary">clair</span>.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Uploadez votre bulletin, laissez l&apos;OCR lire vos notes, et découvrez
          les formations qui vous correspondent — avec une vraie estimation de vos
          chances d&apos;admission.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/predict" className={cn(buttonVariants({ size: "lg" }))}>
            Je suis étudiant
          </Link>
          <Link
            href="/prepare"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Je suis une école
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <GraduationCap className="size-8 text-primary" />
            <CardTitle className="text-xl">Predict — côté étudiant</CardTitle>
            <CardDescription>
              Importez votre bulletin, vérifiez vos notes et obtenez votre top 10
              de formations classées par adéquation et probabilité d&apos;admission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/predict"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Commencer mon orientation
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <School className="size-8 text-primary" />
            <CardTitle className="text-xl">Prepare — côté école</CardTitle>
            <CardDescription>
              Déclarez vos formations, vos critères d&apos;admission et vos matières
              clés, puis suivez les candidats qui vous correspondent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/prepare"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Accéder au tableau de bord
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Pourquoi Scoolize ?
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Parcoursup est vécu comme opaque : peu de visibilité sur ses chances,
            pas de distinction claire entre formations, saisie fastidieuse. On
            attaque ces trois points.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="size-6 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-muted/40 p-8 text-center">
        <FileText className="mx-auto size-8 text-primary" />
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Projet pédagogique — données de démonstration inspirées de l&apos;open
          data Parcoursup (data.gouv.fr). Aucune donnée réelle d&apos;élève.
        </p>
      </section>
    </div>
  );
}
