import { phrases } from "./excuses.js";

/** Return the available lowercase category names as a fresh array. */
export function categories() {
  return Object.keys(phrases);
}

/**
 * Choose an excuse. Seeds are stateless and deterministic within this version.
 * @param {string} [category='deployment'] Category (case insensitive).
 * @param {{seed?: string | number}} [options] Optional string or finite number seed.
 * @returns {string} An original workplace-safe excuse.
 */
export function excuse(category = "deployment", options = {}) {
  if (typeof category !== "string" || !category.trim())
    throw new TypeError("Category must be a nonempty string.");
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new TypeError("Options must be an object.");
  const key = category.trim().toLowerCase();
  if (!Object.hasOwn(phrases, key))
    throw new RangeError(
      `Unknown category: ${category}. Choose: ${categories().join(", ")}.`,
    );
  const { seed } = options;
  let index;
  if (seed === undefined) {
    index = Math.floor(Math.random() * phrases[key].length);
  } else {
    if (
      typeof seed !== "string" &&
      !(typeof seed === "number" && Number.isFinite(seed))
    )
      throw new TypeError("Seed must be a string or finite number.");
    // FNV-1a over UTF-16 code units. Type tagging distinguishes 1 from "1".
    const input = `${key}:${typeof seed}:${seed}`;
    let hash = 2166136261;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    index = hash % phrases[key].length;
  }
  return phrases[key][index];
}

/** Generate a batch without repeats until the category pool is exhausted. */
export function excuseBatch(category = "deployment", options = {}) {
  if (!options || typeof options !== "object" || Array.isArray(options))
    throw new TypeError("Options must be an object.");
  const count = options.count ?? 3;
  if (!Number.isSafeInteger(count) || count < 1 || count > 20)
    throw new RangeError("count must be an integer between 1 and 20.");
  const first = excuse(category, { seed: options.seed });
  const pool = phrases[category.trim().toLowerCase()];
  const start = pool.indexOf(first);
  return Array.from(
    { length: count },
    (_, i) => pool[(start + i) % pool.length],
  );
}
