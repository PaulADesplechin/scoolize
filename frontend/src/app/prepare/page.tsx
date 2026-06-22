"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Plus, Sparkles, Users } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  api,
  type Candidate,
  type PrepareStats,
  type Program,
} from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ErrorBanner } from "@/components/error-banner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  cn,
  errorMessage,
  programTypeBadgeVariant,
  programTypeLabel,
} from "@/lib/utils";

const PIE_COLORS = [
  "#4263eb",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#9333ea",
  "#0ea5e9",
  "#14b8a6",
  "#f43f5e",
];

export default function PrepareDashboard() {
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<PrepareStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.listPrograms(), api.candidates(), api.prepareStats()])
      .then(([p, c, s]) => {
        setPrograms(p);
        setCandidates(c);
        setStats(s);
      })
      .catch((e: unknown) =>
        setError(errorMessage(e, "Erreur de chargement")),
      );
  }, []);

  const selective = programs?.filter((p) => p.type === "selective").length ?? 0;
  const nonSelective =
    programs?.filter((p) => p.type === "non_selective").length ?? 0;

  const topStats = [
    { label: "Formations", value: programs?.length ?? 0, icon: Layers },
    { label: "Sélectives", value: selective, icon: Sparkles },
    { label: "Non-sélectives", value: nonSelective, icon: Layers },
    { label: "Candidatures", value: candidates.length, icon: Users },
  ];

  const pieData = (stats?.by_program ?? []).map((p) => ({
    name:
      p.program_name.length > 28
        ? `${p.program_name.slice(0, 28)}…`
        : p.program_name,
    value: p.nb_candidates,
  }));

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
        <ErrorBanner message={`${error} — vérifiez que l'API tourne sur localhost:8000.`} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topStats.map((s) => (
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

      {stats && stats.by_program.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des candidatures</CardTitle>
              <CardDescription>
                {stats.total_candidates} candidatures sur {stats.by_program.length} formations actives.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry: { value?: number }) => entry.value ?? ""}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats par formation</CardTitle>
              <CardDescription>
                Triées par nombre de candidatures décroissant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.by_program.map((p) => (
                <div key={p.program_id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.program_name}</span>
                        <Badge variant={programTypeBadgeVariant(p.program_type)}>
                          {programTypeLabel(p.program_type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{p.institution}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">
                        {p.nb_candidates} candidat{p.nb_candidates > 1 ? "s" : ""}
                      </div>
                      {p.avg_score !== null && (
                        <div className="text-muted-foreground">
                          score moyen {p.avg_score}
                        </div>
                      )}
                      {p.fill_rate !== null && (
                        <div className="text-muted-foreground">
                          {Math.round(p.fill_rate * 100)}% rempli
                        </div>
                      )}
                    </div>
                  </div>
                  {p.top_schools.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span>Top lycées :</span>
                      {p.top_schools.map((school) => (
                        <span
                          key={school.name}
                          className="rounded-full bg-muted px-2 py-0.5"
                        >
                          {school.name} ({school.count})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

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
                  <Badge variant={programTypeBadgeVariant(program.type)}>
                    {programTypeLabel(program.type)}
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
