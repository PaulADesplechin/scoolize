import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ProgramType } from "@/lib/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Classe Tailwind partagée pour les `<select>` natifs (forme + focus, sans largeur). */
export const SELECT_CLASS =
  "h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

/** Convertit un Error/inconnu en message lisible avec repli. */
export function errorMessage(e: unknown, fallback: string): string {
  return e instanceof Error ? e.message : fallback;
}

/** Libellé FR pour le type d'une formation. */
export function programTypeLabel(type: ProgramType): string {
  return type === "selective" ? "Sélective" : "Non-sélective";
}

/** Variant shadcn associé au type de formation. */
export function programTypeBadgeVariant(
  type: ProgramType,
): "default" | "secondary" {
  return type === "selective" ? "default" : "secondary";
}

/** Tier qualitatif d'un score 0–100. */
export type ScoreTier = "good" | "warn" | "bad";

export function scoreTier(score: number): ScoreTier {
  if (score >= 70) return "good";
  if (score >= 45) return "warn";
  return "bad";
}

/** Couleur hex (Recharts/SVG hors Tailwind). */
export const SCORE_TIER_HEX: Record<ScoreTier, string> = {
  good: "#16a34a",
  warn: "#d97706",
  bad: "#dc2626",
};

/** Classe Tailwind (currentColor) par tier. */
export const SCORE_TIER_CLASS: Record<ScoreTier, string> = {
  good: "text-chart-2",
  warn: "text-chart-3",
  bad: "text-chart-4",
};
