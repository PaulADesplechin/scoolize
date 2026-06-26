import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileRequired({
  message = "Créez d'abord votre profil étudiant pour continuer.",
}: {
  message?: string;
}) {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-bold">Profil requis</h1>
      <p className="text-muted-foreground">{message}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/predict" className={cn(buttonVariants())}>
          Créer mon profil
        </Link>
        <Link
          href="/predict?tab=login"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Déjà un compte ? Se connecter
        </Link>
      </div>
    </div>
  );
}
