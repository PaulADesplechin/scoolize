"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Clock, X } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  api,
  type CandidateDetail,
  type CandidateStatus,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
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
  errorMessage,
  programTypeBadgeVariant,
  programTypeLabel,
} from "@/lib/utils";

function shortLabel(s: string, max = 14) {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

export default function CandidateDetailPage() {
  const params = useParams<{ id: string }>();
  const applicationId = Number(params.id);
  const [detail, setDetail] = useState<CandidateDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!applicationId) return;
    api
      .candidateDetail(applicationId)
      .then(setDetail)
      .catch((e: unknown) =>
        setError(errorMessage(e, "Erreur de chargement")),
      );
  }, [applicationId]);

  async function setStatus(status: CandidateStatus) {
    setUpdating(true);
    try {
      const updated = await api.updateCandidateStatus(applicationId, status);
      setDetail((d) => (d ? { ...d, status: updated.status } : d));
      const label = { accepted: "acceptée", pending: "en attente", rejected: "refusée", submitted: "remise à zéro" }[status];
      toast.success(`Candidature ${label}.`);
    } catch (e) {
      toast.error(errorMessage(e, "Échec de la mise à jour."));
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/prepare/candidates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Retour aux candidats
      </Link>

      {error && <ErrorBanner message={error} />}

      {detail === null && !error && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {detail && (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {detail.student_name}
              </h1>
              <p className="text-muted-foreground">
                {detail.student_school ?? "—"} · {detail.student_track ?? "—"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={programTypeBadgeVariant(detail.program.type)}>
                  {programTypeLabel(detail.program.type)}
                </Badge>
                <Badge variant="outline">Statut · {detail.status}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Candidate à</p>
              <p className="font-semibold">{detail.program.name}</p>
              <p className="text-sm text-muted-foreground">
                {detail.program.institution}
              </p>
              {detail.score !== null && (
                <p className="mt-2 text-2xl font-bold">
                  {detail.score}
                  <span className="text-sm text-muted-foreground"> / 100</span>
                </p>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution par trimestre</CardTitle>
              <CardDescription>
                Note par matière sur les 3 trimestres (T1/T2 projetés à partir
                de la note actuelle T3 pour la démo).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={detail.evolution.map((e) => ({
                      subject: shortLabel(e.subject),
                      "Trimestre 1": e.t1,
                      "Trimestre 2": e.t2,
                      "Trimestre 3": e.t3,
                    }))}
                  >
                    <XAxis
                      dataKey="subject"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      angle={-25}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      domain={[0, 20]}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Trimestre 1" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Trimestre 2" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Trimestre 3" fill="#4263eb" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {detail.comparison.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notes candidat vs minimum attendu</CardTitle>
                <CardDescription>
                  Vert si la note couvre le seuil indicatif de la formation,
                  rouge sinon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={detail.comparison.map((c) => ({
                        subject: shortLabel(c.subject, 18),
                        "Note candidat": c.student_average ?? 0,
                        Minimum: c.program_minimum ?? 0,
                        meets: c.meets_minimum,
                      }))}
                    >
                      <XAxis
                        dataKey="subject"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[0, 20]}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Note candidat" radius={[3, 3, 0, 0]}>
                        {detail.comparison.map((c, i) => (
                          <Cell
                            key={i}
                            fill={c.meets_minimum ? "#16a34a" : "#dc2626"}
                          />
                        ))}
                      </Bar>
                      <Bar dataKey="Minimum" fill="#e4e4e7" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Toutes les notes</CardTitle>
              <CardDescription>
                Saisies par l&apos;élève après validation de l&apos;OCR.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">Matière</th>
                    <th className="py-2">Période</th>
                    <th className="py-2 text-right">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.grades.map((g) => (
                    <tr
                      key={g.id ?? `${g.subject}-${g.period}`}
                      className="border-b border-border"
                    >
                      <td className="py-1.5">{g.subject}</td>
                      <td className="py-1.5 text-muted-foreground">
                        {g.period ?? "—"}
                      </td>
                      <td className="py-1.5 text-right font-medium">
                        {g.value.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                  {detail.grades.length === 0 && (
                    <tr>
                      <td className="py-2 text-muted-foreground" colSpan={3}>
                        Aucune note remontée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setStatus("accepted")}
              disabled={updating || detail.status === "accepted"}
            >
              <Check className="size-4" /> Accepter
            </Button>
            <Button
              variant="outline"
              onClick={() => setStatus("pending")}
              disabled={updating || detail.status === "pending"}
            >
              <Clock className="size-4" /> Mettre en attente
            </Button>
            <Button
              variant="outline"
              onClick={() => setStatus("rejected")}
              disabled={updating || detail.status === "rejected"}
            >
              <X className="size-4" /> Refuser
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
