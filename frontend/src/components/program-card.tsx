"use client";

import { useState } from "react";
import { Check, MapPin } from "lucide-react";
import { toast } from "sonner";

import { api, type MatchResult } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreGauge } from "@/components/score-gauge";

export function ProgramCard({
  result,
  alreadyApplied = false,
}: {
  result: MatchResult;
  alreadyApplied?: boolean;
}) {
  const program = result.program;
  const [applied, setApplied] = useState(alreadyApplied);
  const [loading, setLoading] = useState(false);

  async function apply() {
    setLoading(true);
    try {
      await api.apply(program.id);
      setApplied(true);
      toast.success(`Candidature envoyée : ${program.name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de la candidature.");
    } finally {
      setLoading(false);
    }
  }

  const location = [program.city, program.region].filter(Boolean).join(", ");

  return (
    <Card>
      <CardContent className="flex gap-4 p-4">
        <ScoreGauge value={result.score} />
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{program.name}</span>
            <Badge variant={program.type === "selective" ? "default" : "secondary"}>
              {program.type === "selective" ? "Sélective" : "Non-sélective"}
            </Badge>
            {result.eligible ? (
              <Badge variant="outline">Éligible</Badge>
            ) : (
              <Badge variant="destructive">Sous le seuil</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{program.institution}</p>
          {location && (
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> {location}
            </p>
          )}
          <p className="text-sm">{result.rationale}</p>
          <p className="text-xs text-muted-foreground">
            Intervalle de confiance : {result.confidence_low} – {result.confidence_high}
          </p>
          <Button size="sm" onClick={apply} disabled={loading || applied}>
            {applied ? (
              <>
                <Check className="size-4" /> Candidaté
              </>
            ) : loading ? (
              "Envoi…"
            ) : (
              "Candidater"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
