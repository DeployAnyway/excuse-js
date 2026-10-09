import { excuse } from "./index.js";
const iso = (value, label) => {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 19) !== value.slice(0, 19)
  )
    throw new TypeError(`${label} must be a UTC ISO timestamp.`);
  return value;
};
const clean = (value) =>
  Array.from(value)
    .filter(
      (char) => char.charCodeAt(0) >= 32 || char === "\n" || char === "\t",
    )
    .join("");
/** Draft factual incident communication; public output never adds a joke. */
export function incidentUpdate(facts = {}, options = {}) {
  if (!facts || typeof facts !== "object" || Array.isArray(facts))
    throw new TypeError("Incident facts must be an object.");
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new TypeError("Options must be an object.");
  const status = facts.status ?? "investigating",
    audience = options.audience ?? "public",
    humor = options.humor ?? false;
  if (
    !["investigating", "identified", "monitoring", "resolved"].includes(status)
  )
    throw new RangeError("Unsupported incident status.");
  if (!["public", "internal"].includes(audience) || typeof humor !== "boolean")
    throw new TypeError("Choose public/internal audience and boolean humor.");
  if (humor && audience !== "internal")
    throw new TypeError("Comic relief requires an internal audience.");
  const result = { status, audience, missing: [], overdue: false };
  for (const key of ["service", "impact", "action", "owner"]) {
    if (
      facts[key] !== undefined &&
      facts[key] !== null &&
      (typeof facts[key] !== "string" ||
        !facts[key].trim() ||
        facts[key].length > 2000)
    )
      throw new TypeError(
        `${key} must be a nonempty string up to 2000 characters.`,
      );
    result[key] =
      facts[key] === undefined || facts[key] === null
        ? null
        : clean(facts[key].trim());
    if (result[key] === null) result.missing.push(key);
  }
  const now = iso(options.now ?? new Date().toISOString(), "now");
  result.nextUpdate =
    facts.nextUpdate === undefined || facts.nextUpdate === null
      ? null
      : iso(facts.nextUpdate, "nextUpdate");
  if (result.nextUpdate === null && status !== "resolved")
    result.missing.push("nextUpdate");
  result.overdue =
    status !== "resolved" &&
    result.nextUpdate !== null &&
    Date.parse(result.nextUpdate) < Date.parse(now);
  const lines = [
    `Status: ${status}`,
    `Service: ${result.service ?? "Not provided"}`,
    `Impact: ${result.impact ?? "Not provided — verify before claiming an impact"}`,
    `Current action: ${result.action ?? "Not provided"}`,
    `Owner: ${result.owner ?? "Not assigned"}`,
    `Next update: ${result.nextUpdate ?? (status === "resolved" ? "Not scheduled (status marked resolved)" : "Not scheduled")}${result.overdue ? " — OVERDUE" : ""}`,
  ];
  if (result.missing.length)
    lines.push("Missing facts: " + result.missing.join(", "));
  result.complete = result.missing.length === 0;
  if (humor) {
    result.comicRelief = excuse(options.category ?? "production", {
      seed: options.seed,
    });
    lines.push("\nComic relief (internal only): " + result.comicRelief);
  }
  result.message = lines.join("\n");
  return result;
}
