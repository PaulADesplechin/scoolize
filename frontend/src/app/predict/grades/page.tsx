"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { api, updateStoredStudent, type Grade, type Student } from "@/lib/api";
import { SUBJECTS } from "@/lib/constants";
import { useStoredStudent } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileRequired } from "@/components/profile-required";
import { cn, errorMessage, SELECT_CLASS } from "@/lib/utils";

const EXTRACTED_KEY = "scoolize_extracted";

interface Row {
  subject: string;
  value: string;
}

function pickInitialRows(student: Student | null): { rows: Row[]; fromOcr: boolean } {
  const fallback = { rows: [{ subject: "Mathématiques", value: "" }], fromOcr: false };
  if (!student) return fallback;

  const raw =
    typeof window !== "undefined" ? window.localStorage.getItem(EXTRACTED_KEY) : null;
  if (raw) {
    const extracted = JSON.parse(raw) as Record<string, number>;
    const rows = Object.entries(extracted).map(([subject, value]) => ({
      subject,
      value: String(value),
    }));
    if (rows.length > 0) return { rows, fromOcr: true };
  }
  if (student.grades?.length) {
    return {
      rows: student.grades.map((g) => ({ subject: g.subject, value: String(g.value) })),
      fromOcr: false,
    };
  }
  return fallback;
}

export default function GradesPage() {
  const router = useRouter();
  const { student, ready } = useStoredStudent();
  const [rows, setRows] = useState<Row[]>([]);
  const [fromOcr, setFromOcr] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const { rows: initial, fromOcr: ocr } = pickInitialRows(student);
    setRows(initial);
    setFromOcr(ocr);
  }, [ready, student]);

  function patch(index: number, p: Partial<Row>) {
    setRows((rs) => rs.map((r, i) => (i === index ? { ...r, ...p } : r)));
  }

  async function save() {
    if (!student) return;
    const grades: Grade[] = [];
    for (const row of rows) {
      const value = parseFloat(row.value.replace(",", "."));
      if (row.subject && !Number.isNaN(value) && value >= 0 && value <= 20) {
        grades.push({ subject: row.subject, value });
      }
    }
    if (grades.length === 0) {
      toast.error("Ajoutez au moins une note valide (0 à 20).");
      return;
    }
    setSaving(true);
    try {
      await api.addGrades(student.id, grades);
      const refreshed = await api.getStudent(student.id);
      updateStoredStudent(refreshed);
      window.localStorage.removeItem(EXTRACTED_KEY);
      toast.success("Notes validées.");
      router.push("/predict/results");
    } catch (e) {
      toast.error(errorMessage(e, "Échec de l'enregistrement."));
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return null;
  if (!student) return <ProfileRequired />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Vérifiez vos notes</h1>
        <p className="text-muted-foreground">
          {fromOcr
            ? "Notes extraites par OCR — corrigez si besoin avant de valider."
            : "Saisissez vos moyennes par matière (sur 20)."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes moyennes</CardTitle>
          <CardDescription>La validation humaine reste indispensable.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                className={cn(SELECT_CLASS, "flex-1")}
                value={SUBJECTS.includes(row.subject) ? row.subject : "__other"}
                onChange={(e) =>
                  patch(i, {
                    subject: e.target.value === "__other" ? "" : e.target.value,
                  })
                }
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                {!SUBJECTS.includes(row.subject) && (
                  <option value="__other">{row.subject || "Autre…"}</option>
                )}
              </select>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="20"
                className="w-24"
                placeholder="/20"
                value={row.value}
                onChange={(e) => patch(i, { value: e.target.value })}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                disabled={rows.length === 1}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setRows((rs) => [...rs, { subject: "Français", value: "" }])}
          >
            <Plus className="size-4" /> Ajouter une matière
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? "Enregistrement…" : "Valider et voir mes formations"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
