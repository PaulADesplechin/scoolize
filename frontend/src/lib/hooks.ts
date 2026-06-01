"use client";

import { useEffect, useState } from "react";

import { getStoredStudent, type Student } from "@/lib/api";

/**
 * Charge l'étudiant depuis localStorage après le mount.
 * `ready` reste false pendant le SSR pour éviter une hydratation différée.
 */
export function useStoredStudent() {
  const [student, setStudent] = useState<Student | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStudent(getStoredStudent());
    setReady(true);
  }, []);

  return { student, setStudent, ready };
}
