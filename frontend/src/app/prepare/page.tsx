"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Plus, Sparkles, Users } from "lucide-react";

import { api, type Candidate, type Program } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function PrepareDashboard() {
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.listPrograms(), api.candidates()])
      .then(([p, c]) => {
        setPrograms(p);
        setCandidates(c);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Erreur de chargement"),
      );
  }, []);

  const selective = programs?.filter((p) => p.type === "selective").length ?? 0;
  const nonSelective =
    programs?.filter((p) => p.type === "non_selective").length ?? 0;

  const stats = [
    { label: "Formations", value: programs?.length ?? 0, icon: Layers },
    { label: "Sélectives", value: selective, icon: Sparkles },
    { label: "Non-sélectives", value: nonSelective, icon: Layers },
    { label: "Candidatures", value: candidates.length, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord école</h1>
          <p className="text-muted-foreground">
            Gérez vos formations et suivez les candidats qui vous correspondent.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/prepare/candidates" className={cn(buttonVariants({ variant: "outline" }))}>
            <Users className="size-4" /> Candidats
          </Link>
          <Link href="/prepare/new-program" className={cn(buttonVariants())}>
            <Plus className="size-4" /> Nouvelle formation
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error} — vérifiez que l&apos;API tourne sur {" "}
          <code className="font-mono">localhost:8000</code>.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{s.label}</CardDescription>
              <s.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {programs === null ? <Skeleton className="h-8 w-12" /> : s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formations déclarées</CardTitle>
          <CardDescription>
            Les formations visibles côté étudiant dans le matching.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {programs === null &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}

          {programs?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucune formation pour l&apos;instant.{" "}
              <Link href="/prepare/new-program" className="text-primary underline">
                Créez la première
              </Link>
              .
            </p>
          )}

          {programs?.slice(0, 12).map((program) => (
            <div
              key={program.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{program.name}</span>
                  <Badge variant={program.type === "selective" ? "default" : "secondary"}>
                    {program.type === "selective" ? "Sélective" : "Non-sélective"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {program.institution}
                  {program.city ? ` · ${program.city}` : ""}
                </p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {program.capacity ? `${program.capacity} places` : "—"}
                {program.admission_rate != null
                  ? ` · ${Math.round(program.admission_rate * 100)}% admis`
                  : ""}
              </div>
            </div>
          ))}

          {programs && programs.length > 12 && (
            <p className="text-sm text-muted-foreground">
              … et {programs.length - 12} autres formations.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
