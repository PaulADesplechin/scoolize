import { GraduationCap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-4 text-primary" />
          <span>
            Scoolize · Projet réalisé dans le cadre du parcours Epitech Digital · 2026
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Paul-Adrien Desplechin · Hugo Ladrat · Nino Taravella</span>
          <a
            href="https://github.com/PaulADesplechin/scoolize"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
