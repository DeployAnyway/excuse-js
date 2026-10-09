export type Category =
  | "deployment"
  | "build"
  | "production"
  | "bug"
  | "api"
  | "database"
  | "deadline"
  | "testing"
  | "network"
  | "merge-conflict"
  | "demo";
export interface ExcuseOptions {
  seed?: string | number;
}
export interface ExcuseReport {
  category: Category;
  excuse: string;
  nextStep: string;
}
export function categories(): Category[];
export function excuse(category?: Category, options?: ExcuseOptions): string;
export function excuseBatch(
  category?: Category,
  options?: ExcuseOptions & { count?: number },
): string[];
export function excuseReport(
  category?: Category,
  options?: ExcuseOptions,
): ExcuseReport;

export function listExcuses(category?: Category): string[];
export type IncidentStatus =
  "investigating" | "identified" | "monitoring" | "resolved";
export interface IncidentFacts {
  status?: IncidentStatus;
  service?: string | null;
  impact?: string | null;
  action?: string | null;
  owner?: string | null;
  nextUpdate?: string | null;
}
export interface IncidentOptions extends ExcuseOptions {
  audience?: "public" | "internal";
  humor?: boolean;
  category?: Category;
  now?: string;
}
export interface IncidentUpdate {
  complete: boolean;
  status: IncidentStatus;
  audience: "public" | "internal";
  service: string | null;
  impact: string | null;
  action: string | null;
  owner: string | null;
  nextUpdate: string | null;
  missing: string[];
  overdue: boolean;
  comicRelief?: string;
  message: string;
}
export function incidentUpdate(
  facts?: IncidentFacts,
  options?: IncidentOptions,
): IncidentUpdate;
