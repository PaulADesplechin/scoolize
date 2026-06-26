"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  api,
  clearSession,
  setSession,
  studentIdFromToken,
  type School,
} from "@/lib/api";
import { useStoredStudent } from "@/lib/hooks";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, errorMessage, SELECT_CLASS } from "@/lib/utils";

export default function PredictHome() {
  const router = useRouter();
  const { student, setStudent, ready } = useStoredStudent();
  const [schools, setSchools] = useState<School[]>([]);
  const [tab, setTab] = useState("signup");
  const [submitting, setSubmitting] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    school_id: "",
    track: "Générale — spé Mathématiques, Physique-Chimie",
  });
  const [login, setLogin] = useState({ email: "", password: "" });

  useEffect(() => {
    api.listSchools().then(setSchools).catch(() => undefined);
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("tab") === "login"
    ) {
      setTab("login");
    }
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSignup(e: React.FormEvent) {
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
      setStudent(created);
      toast.success("Profil créé, place à l'analyse de votre bulletin !");
      router.push("/predict/upload");
    } catch (err) {
      toast.error(errorMessage(err, "Échec de la création."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!login.email.trim() || !login.password) {
      toast.error("Renseignez votre email et votre mot de passe.");
      return;
    }
    setLoggingIn(true);
    try {
      const { access_token } = await api.login(login.email.trim(), login.password);
      const id = studentIdFromToken(access_token);
      if (!id) throw new Error("Session invalide, réessayez.");
      const me = await api.getStudent(id);
      setSession(access_token, me);
      setStudent(me);
      toast.success(`Bon retour, ${me.first_name} !`);
      router.push("/predict/upload");
    } catch {
      toast.error("Email ou mot de passe incorrect.");
    } finally {
      setLoggingIn(false);
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
        <h1 className="text-2xl font-bold">Espace étudiant</h1>
        <p className="text-muted-foreground">
          Créez votre profil ou reconnectez-vous pour analyser votre bulletin.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as string)}
        className="flex-col"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Créer un compte</TabsTrigger>
          <TabsTrigger value="login">Se connecter</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Mon profil</CardTitle>
              <CardDescription>Vos données restent sur cette démo.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
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
                    className={cn(SELECT_CLASS, "w-full")}
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
                <p className="text-center text-sm text-muted-foreground">
                  Déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="font-medium text-primary hover:underline"
                  >
                    Se connecter
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Se connecter</CardTitle>
              <CardDescription>
                Comptes de démo : <code className="font-mono">demo1234</code> (ex.
                lea.martin@demo.scoolize.fr).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login_email">Email</Label>
                  <Input
                    id="login_email"
                    type="email"
                    value={login.email}
                    onChange={(e) =>
                      setLogin((l) => ({ ...l, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login_password">Mot de passe</Label>
                  <Input
                    id="login_password"
                    type="password"
                    value={login.password}
                    onChange={(e) =>
                      setLogin((l) => ({ ...l, password: e.target.value }))
                    }
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loggingIn}>
                  {loggingIn ? "Connexion…" : "Se connecter"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("signup")}
                    className="font-medium text-primary hover:underline"
                  >
                    Créer un compte
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
