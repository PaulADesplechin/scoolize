"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { api, type ProgramType } from "@/lib/api";
import { DOMAINS, REGIONS, SUBJECTS } from "@/lib/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, errorMessage, SELECT_CLASS } from "@/lib/utils";

interface SubjectRow {
  subject: string;
  weight: string;
}

export default function NewProgramPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    institution: "",
    type: "selective" as ProgramType,
    domain: "Sciences",
    city: "",
    region: "Île-de-France",
    capacity: "",
    admission_rate: "",
    min_average: "",
  });
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { subject: "Mathématiques", weight: "0.5" },
  ]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function patchSubject(index: number, patch: Partial<SubjectRow>) {
    setSubjects((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.institution.trim()) {
      toast.error("Le nom et l'établissement sont obligatoires.");
      return;
    }
    const keySubjects: Record<string, number> = {};
    for (const row of subjects) {
      const weight = parseFloat(row.weight);
      if (row.subject && !Number.isNaN(weight)) keySubjects[row.subject] = weight;
    }

    setSubmitting(true);
    try {
      await api.createProgram({
        name: form.name.trim(),
        institution: form.institution.trim(),
        type: form.type,
        domain: form.domain || null,
        city: form.city.trim() || null,
        region: form.region || null,
        capacity: form.capacity ? parseInt(form.capacity, 10) : null,
        admission_rate: form.admission_rate
          ? parseFloat(form.admission_rate) / 100
          : null,
        min_average:
          form.type === "selective" && form.min_average
            ? parseFloat(form.min_average)
            : null,
        key_subjects: keySubjects,
      });
      toast.success("Formation créée avec succès.");
      router.push("/prepare");
    } catch (err) {
      toast.error(errorMessage(err, "Échec de la création."));
    } finally {
      setSubmitting(false);
    }
  }

  const selectFull = cn(SELECT_CLASS, "w-full");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/prepare"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Retour au tableau de bord
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle formation</CardTitle>
          <CardDescription>
            Déclarez les critères d&apos;admission et les matières clés pour le
            matching.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">Intitulé de la formation *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="CPGE MPSI, Licence Informatique…"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="institution">Établissement *</Label>
                <Input
                  id="institution"
                  value={form.institution}
                  onChange={(e) => update("institution", e.target.value)}
                  placeholder="Lycée Louis-le-Grand, Université Paris Cité…"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className={selectFull}
                  value={form.type}
                  onChange={(e) => update("type", e.target.value as ProgramType)}
                >
                  <option value="selective">Sélective</option>
                  <option value="non_selective">Non-sélective</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="domain">Domaine</Label>
                <select
                  id="domain"
                  className={selectFull}
                  value={form.domain}
                  onChange={(e) => update("domain", e.target.value)}
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Paris"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="region">Région</Label>
                <select
                  id="region"
                  className={selectFull}
                  value={form.region}
                  onChange={(e) => update("region", e.target.value)}
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacité (places)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  placeholder="120"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admission_rate">Taux d&apos;admission (%)</Label>
                <Input
                  id="admission_rate"
                  type="number"
                  min="0"
                  max="100"
                  value={form.admission_rate}
                  onChange={(e) => update("admission_rate", e.target.value)}
                  placeholder="15"
                />
              </div>

              {form.type === "selective" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="min_average">
                    Moyenne minimale indicative (/20)
                  </Label>
                  <Input
                    id="min_average"
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={form.min_average}
                    onChange={(e) => update("min_average", e.target.value)}
                    placeholder="14"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Matières clés (pondérées)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSubjects((rows) => [
                      ...rows,
                      { subject: "Français", weight: "0.3" },
                    ])
                  }
                >
                  <Plus className="size-4" /> Ajouter
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Le poids reflète l&apos;importance de la matière dans la sélection
                (les poids sont normalisés par l&apos;algorithme).
              </p>
              <div className="space-y-2">
                {subjects.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      className={selectFull}
                      value={row.subject}
                      onChange={(e) => patchSubject(i, { subject: e.target.value })}
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      className="w-24"
                      value={row.weight}
                      onChange={(e) => patchSubject(i, { weight: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSubjects((rows) => rows.filter((_, j) => j !== i))
                      }
                      disabled={subjects.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/prepare" className={cn(buttonVariants({ variant: "outline" }))}>
                Annuler
              </Link>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Création…" : "Créer la formation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
