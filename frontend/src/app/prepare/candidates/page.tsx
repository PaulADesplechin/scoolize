"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

import { api, type Candidate, type Program } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const SELECT_CLASS =
  "h-9 w-full max-w-xs rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function exportCsv(rows: Candidate[]) {
  const header = ["Candidat", "Lycée", "Filière", "Formation", "Type", "Score", "Statut"];
  const body = rows.map((r) => [
    r.student_name,
    r.student_school ?? "",
    r.student_track ?? "",
    r.program_name,
    r.program_type === "selective" ? "Sélective" : "Non-sélective",
    r.score != null ? String(r.score) : "",
    r.status,
  ]);
  const csv = [header, ...body]
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "candidats-scoolize.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function CandidatesPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listPrograms().then(setPrograms).catch(() => undefined);
  }, []);

  useEffect(() => {
    setCandidates(null);
    api
      .candidates(filter ? Number(filter) : undefined)
      .then(setCandidates)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Erreur de chargement"),
      );
  }, [filter]);

  return (
    <div className="space-y-6">
      <Link
        href="/prepare"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Retour au tableau de bord
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidats</h1>
          <p className="text-muted-foreground">
            Les étudiants ayant candidaté, classés par score de matching.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => candidates && exportCsv(candidates)}
          disabled={!candidates || candidates.length === 0}
        >
          <Download className="size-4" /> Exporter en CSV
        </Button>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="filter" className="text-sm font-medium">
          Filtrer par formation
        </label>
        <select
          id="filter"
          className={SELECT_CLASS}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Toutes les formations</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.institution}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {candidates ? `${candidates.length} candidature(s)` : "Chargement…"}
          </CardTitle>
          <CardDescription>
            Le score est figé au moment de la candidature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {candidates === null ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune candidature pour ce filtre. Les candidatures arrivent depuis le
              parcours étudiant (Predict).
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Lycée</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow key={c.application_id}>
                    <TableCell>
                      <div className="font-medium">{c.student_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.student_track ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.student_school ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">{c.program_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={c.program_type === "selective" ? "default" : "secondary"}
                      >
                        {c.program_type === "selective" ? "Sélective" : "Non-sélective"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {c.score != null ? c.score : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
