"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api, type MatchResult } from "@/lib/api";
import { useStoredStudent } from "@/lib/hooks";
import { ProgramCard } from "@/components/program-card";
import { ProfileRequired } from "@/components/profile-required";
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
  errorMessage,
  SCORE_TIER_HEX,
  SELECT_CLASS,
  scoreTier,
} from "@/lib/utils";

export default function ResultsPage() {
  const { student, ready } = useStoredStudent();
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [typeFilter, setTypeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !student) return;
    api
      .match(student.id, 10)
      .then(setResults)
      .catch((e: unknown) => setError(errorMessage(e, "Erreur de chargement")));
    api
      .myApplications()
      .then((apps) => setApplied(new Set(apps.map((a) => a.program_id))))
      .catch(() => undefined);
  }, [ready, student]);

  const regions = useMemo(
    () =>
      Array.from(
        new Set((results ?? []).map((r) => r.program.region).filter(Boolean)),
      ) as string[],
    [results],
  );

  const filtered = useMemo(
    () =>
      (results ?? []).filter(
        (r) =>
          (!typeFilter || r.category === typeFilter) &&
          (!regionFilter || r.program.region === regionFilter),
      ),
    [results, typeFilter, regionFilter],
  );

  const chartData = useMemo(
    () =>
      filtered.slice(0, 8).map((r) => ({
        name:
          r.program.name.length > 20
            ? `${r.program.name.slice(0, 20)}…`
            : r.program.name,
        score: r.score,
      })),
    [filtered],
  );

  if (!ready) return null;
  if (!student) return <ProfileRequired />;

  const noGrades = (student.grades?.length ?? 0) === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Vos formations, {student.first_name}
        </h1>
        <p className="text-muted-foreground">
          Classées par adéquation et probabilité d&apos;admission.
        </p>
      </div>

      {noGrades && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
          Vous n&apos;avez pas encore validé de notes —{" "}
          <Link
            href="/predict/upload"
            className="font-medium text-primary underline"
          >
            importez votre bulletin
          </Link>{" "}
          pour affiner le matching.
        </div>
      )}

      {error && <ErrorBanner message={error} />}

      <div className="flex flex-wrap gap-3">
        <select
          className={SELECT_CLASS}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="selective">Sélectives</option>
          <option value="non_selective">Non-sélectives</option>
        </select>
        <select
          className={SELECT_CLASS}
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="">Toutes les régions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {results === null ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <>
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Comparatif des scores</CardTitle>
                <CardDescription>
                  Score de matching sur 100 (vert ≥ 70, orange ≥ 45, rouge en
                  dessous).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ left: 8, right: 24 }}
                    >
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={150}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {chartData.map((d, i) => (
                          <Cell key={i} fill={SCORE_TIER_HEX[scoreTier(d.score)]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {filtered.map((result) => (
              <ProgramCard
                key={result.program.id}
                result={result}
                alreadyApplied={applied.has(result.program.id)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune formation ne correspond à ces filtres.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
