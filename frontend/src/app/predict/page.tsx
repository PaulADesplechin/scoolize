"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  api,
  clearSession,
  getStoredStudent,
  setSession,
  type School,
  type Student,
} from "@/lib/api";
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
import { cn } from "@/lib/utils";

const SELECT_CLASS =
  "h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function PredictHome() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    school_id: "",
    track: "Générale — spé Mathématiques, Physique-Chimie",
  });

  useEffect(() => {
    setStudent(getStoredStudent());
    setReady(true);
    api.listSchools().then(setSchools).catch(() => undefined);
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      form.password.length < 6
    ) {
      toast.error("Renseignez vos informations (mot de passe ≥ 6 caractères).");
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.createStudent({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        track: form.track || undefined,
        school_id: form.school_id ? Number(form.school_id) : undefined,
      });
      const { access_token } = await api.login(form.email.trim(), form.password);
      setSession(access_token, created);
      toast.success("Profil créé, place à l'analyse de votre bulletin !");
      router.push("/predict/upload");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec de la création.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    clearSession();
    setStudent(null);
    toast.message("Profil déconnecté.");
  }

  if (!ready) return null;

  if (student) {
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <GraduationCap className="mx-auto size-10 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Bon retour, {student.first_name} !</h1>
          <p className="text-muted-foreground">
            Reprenez là où vous en étiez ou consultez vos formations.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/predict/upload" className={cn(buttonVariants())}>
            Analyser un bulletin
          </Link>
          <Link
            href="/predict/results"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Voir mes formations
          </Link>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" /> Changer de profil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2 text-center">
        <GraduationCap className="mx-auto size-10 text-primary" />
        <h1 className="text-2xl font-bold">Créez votre profil étudiant</h1>
        <p className="text-muted-foreground">
          Quelques infos pour démarrer, puis on lit votre bulletin.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
          <CardDescription>Vos données restent sur cette démo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="6 caractères minimum"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="school">Lycée</Label>
              <select
                id="school"
                className={SELECT_CLASS}
                value={form.school_id}
                onChange={(e) => update("school_id", e.target.value)}
              >
                <option value="">— Sélectionnez votre lycée —</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="track">Filière / spécialités</Label>
              <Input
                id="track"
                value={form.track}
                onChange={(e) => update("track", e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Création…" : "Créer mon profil et continuer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
