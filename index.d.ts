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
