export type ProgramType = "selective" | "non_selective";

export interface Program {
  id: number;
  name: string;
  institution: string;
  type: ProgramType;
  domain?: string | null;
  city?: string | null;
  region?: string | null;
  capacity?: number | null;
  admission_rate?: number | null;
  min_average?: number | null;
  key_subjects: Record<string, number>;
}

export type ProgramInput = Omit<Program, "id">;

export interface Grade {
  id?: number;
  subject: string;
  value: number;
  period?: string | null;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  track?: string | null;
  school_id?: number | null;
  grades: Grade[];
}

export interface School {
  id: number;
  name: string;
  uai_code?: string | null;
  city?: string | null;
  region?: string | null;
}

export interface MatchResult {
  program: Program;
  score: number;
  confidence_low: number;
  confidence_high: number;
  category: ProgramType;
  eligible: boolean;
  rationale: string;
}

export interface Application {
  id: number;
  student_id: number;
  program_id: number;
  status: string;
  score_snapshot?: number | null;
}

export interface Candidate {
  application_id: number;
  student_name: string;
  student_school?: string | null;
  student_track?: string | null;
  program_id: number;
  program_name: string;
  program_type: ProgramType;
  score?: number | null;
  status: string;
}

export interface GradeTrimester {
  subject: string;
  t1: number;
  t2: number;
  t3: number;
}

export interface SubjectGap {
  subject: string;
  student_average: number | null;
  program_minimum: number | null;
  weight: number;
  meets_minimum: boolean;
}

export interface CandidateDetail {
  application_id: number;
  status: string;
  score: number | null;
  student_id: number;
  student_name: string;
  student_school: string | null;
  student_track: string | null;
  program: Program;
  grades: Grade[];
  evolution: GradeTrimester[];
  comparison: SubjectGap[];
}

export type CandidateStatus = "submitted" | "accepted" | "pending" | "rejected";

export interface TopSchool {
  name: string;
  count: number;
}

export interface ProgramStats {
  program_id: number;
  program_name: string;
  program_type: ProgramType;
  institution: string;
  capacity: number | null;
  nb_candidates: number;
  avg_score: number | null;
  fill_rate: number | null;
  top_schools: TopSchool[];
}

export interface PrepareStats {
  total_programs: number;
  total_candidates: number;
  by_program: ProgramStats[];
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "scoolize_token";
const STUDENT_KEY = "scoolize_student";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredStudent(): Student | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STUDENT_KEY);
  return raw ? (JSON.parse(raw) as Student) : null;
}

export function setSession(token: string, student: Student): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
}

export function updateStoredStudent(student: Student): void {
  window.localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
}

export function clearSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(STUDENT_KEY);
}

/** Extrait l'id étudiant du `sub` d'un JWT (le login ne renvoie que le token). */
export function studentIdFromToken(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const sub = (JSON.parse(json) as { sub?: string }).sub;
    return sub ? Number(sub) : null;
  } catch {
    return null;
  }
}

async function errorDetail(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { detail?: string | { msg: string }[] };
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) return data.detail.map((d) => d.msg).join(", ");
  } catch {
    /* corps non-JSON */
  }
  return `Erreur ${res.status}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {};
  // Laisse le navigateur poser le boundary du multipart si c'est un FormData.
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (options.headers) Object.assign(headers, options.headers as Record<string, string>);
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await errorDetail(res));
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function qs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") sp.set(key, String(value));
  }
  const out = sp.toString();
  return out ? `?${out}` : "";
}

export const api = {
  listPrograms: (
    params: { type?: string; region?: string; domain?: string; q?: string } = {},
  ) => request<Program[]>(`/api/programs${qs(params)}`),

  createProgram: (body: ProgramInput) =>
    request<Program>("/api/programs", { method: "POST", body: JSON.stringify(body) }),

  listSchools: () => request<School[]>("/api/schools"),

  createStudent: (body: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    track?: string;
    school_id?: number;
  }) => request<Student>("/api/students", { method: "POST", body: JSON.stringify(body) }),

  login: (email: string, password: string) =>
    request<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getStudent: (id: number) => request<Student>(`/api/students/${id}`),

  addGrades: (id: number, grades: Grade[]) =>
    request<Grade[]>(`/api/students/${id}/grades`, {
      method: "POST",
      body: JSON.stringify(grades),
    }, true),

  uploadBulletin: (id: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return request<{ filename: string; extracted: Record<string, number> }>(
      `/api/students/${id}/upload`,
      { method: "POST", body: fd },
      true,
    );
  },

  match: (id: number, limit = 10) =>
    request<MatchResult[]>(`/api/match/${id}?limit=${limit}`),

  apply: (programId: number) =>
    request<Application>("/api/applications", {
      method: "POST",
      body: JSON.stringify({ program_id: programId }),
    }, true),

  myApplications: () => request<Application[]>("/api/applications/me", {}, true),

  candidates: (programId?: number) =>
    request<Candidate[]>(`/api/candidates${programId ? `?program_id=${programId}` : ""}`),

  candidateDetail: (applicationId: number) =>
    request<CandidateDetail>(`/api/candidates/${applicationId}`),

  updateCandidateStatus: (applicationId: number, status: CandidateStatus) =>
    request<Candidate>(`/api/candidates/${applicationId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  prepareStats: () => request<PrepareStats>("/api/prepare/stats"),
};
