"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { useStoredStudent } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileRequired } from "@/components/profile-required";
import { cn, errorMessage } from "@/lib/utils";

const EXTRACTED_KEY = "scoolize_extracted";

export default function UploadPage() {
  const router = useRouter();
  const { student, ready } = useStoredStudent();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(selected: File | null | undefined) {
    if (!selected) return;
    if (selected.type !== "application/pdf" && !selected.name.endsWith(".pdf")) {
      toast.error("Merci de déposer un fichier PDF.");
      return;
    }
    setFile(selected);
  }

  async function analyze() {
    if (!file || !student) return;
    setLoading(true);
    try {
      const res = await api.uploadBulletin(student.id, file);
      window.localStorage.setItem(EXTRACTED_KEY, JSON.stringify(res.extracted));
      const count = Object.keys(res.extracted).length;
      if (count === 0) {
        toast.message("Aucune note détectée — vous pourrez les saisir à la main.");
      } else {
        toast.success(`${count} note(s) extraite(s) du bulletin.`);
      }
      router.push("/predict/grades");
    } catch (e) {
      toast.error(errorMessage(e, "Échec de l'analyse OCR."));
    } finally {
      setLoading(false);
    }
  }

  function manualEntry() {
    window.localStorage.setItem(EXTRACTED_KEY, JSON.stringify({}));
    router.push("/predict/grades");
  }

  if (!ready) return null;

  if (!student) {
    return (
      <ProfileRequired message="Créez d'abord votre profil étudiant pour analyser un bulletin." />
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Importez votre bulletin</h1>
        <p className="text-muted-foreground">
          Format PDF. L&apos;OCR (Tesseract) lit vos notes ; vous validez juste après.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bulletin PDF</CardTitle>
          <CardDescription>
            Glissez-déposez ou sélectionnez votre fichier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors",
              dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            )}
          >
            {file ? (
              <>
                <FileText className="size-8 text-primary" />
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} Ko — cliquez pour changer
                </p>
              </>
            ) : (
              <>
                <UploadCloud className="size-8 text-muted-foreground" />
                <p className="font-medium">Déposez votre bulletin ici</p>
                <p className="text-xs text-muted-foreground">ou cliquez pour parcourir</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="ghost" onClick={manualEntry} disabled={loading}>
              Saisir mes notes à la main
            </Button>
            <Button onClick={analyze} disabled={!file || loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Analyse en cours…
                </>
              ) : (
                "Analyser le bulletin"
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Pas de bulletin sous la main ? Des exemples sont fournis dans{" "}
            <code className="font-mono">data/sample_bulletins/</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
