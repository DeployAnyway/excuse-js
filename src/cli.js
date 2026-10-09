import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import {
  excuse,
  categories,
  excuseBatch,
  excuseReport,
  listExcuses,
  incidentUpdate,
} from "./index.js";
import { readStdin } from "./input.js";

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      seed: { type: "string" },
      list: { type: "boolean" },
      count: { type: "string" },
      json: { type: "boolean" },
      report: { type: "boolean" },
      catalog: { type: "boolean" },
      incident: { type: "boolean" },
      "require-complete": { type: "boolean" },
      audience: { type: "string" },
      humor: { type: "boolean" },
      now: { type: "string" },
    },
  });
  if (values.help) {
    console.log(
      "Usage: excuse-js [category] [--seed text] [--count 3] [--json]\n\n--incident reads factual incident JSON from stdin. --audience public|internal, --humor (internal only), --now UTC-ISO and --require-complete support accountable drafts. No message is sent.\n\nDefault category: deployment. --report pairs the joke with an honest next step.\n\nOptions:\n  --seed text    Repeatable selection (always a string seed)\n  --count 1..20  Prepare a batch for the meeting\n  --json         Structured string or batch\n  --catalog      Show every phrase in a category\n  --list         List categories\n  -h, --help     Show help\n  -v, --version  Show version\n\nExample: excuse-js deployment --seed demo\nExit codes: 0 success/draft; 1 incomplete required incident; 2 invalid arguments.",
    );
  } else if (values.version) {
    console.log(
      JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
      ).version,
    );
  } else if (values.incident) {
    if (
      positionals.length ||
      values.list ||
      values.catalog ||
      values.report ||
      values.count !== undefined
    )
      throw new TypeError(
        "--incident reads JSON stdin and cannot combine with category, list, catalog, report or count.",
      );
    const result = incidentUpdate(JSON.parse(await readStdin()), {
      audience: values.audience ?? "public",
      humor: values.humor ?? false,
      seed: values.seed,
      ...(values.now !== undefined ? { now: values.now } : {}),
    });
    console.log(values.json ? JSON.stringify(result, null, 2) : result.message);
    if (values["require-complete"] && !result.complete) process.exitCode = 1;
  } else if (
    values.audience !== undefined ||
    values.humor ||
    values.now !== undefined ||
    values["require-complete"]
  ) {
    throw new TypeError("--audience, --humor and --now require --incident.");
  } else if (values.list) {
    if (
      positionals.length ||
      values.seed !== undefined ||
      values.count !== undefined ||
      values.json ||
      values.report ||
      values.catalog
    )
      throw new TypeError("--list does not accept a category or seed.");
    console.log(categories().join("\n"));
  } else {
    if (positionals.length > 1)
      throw new TypeError("Provide only one category.");
    if (values.count !== undefined && !/^[0-9]+$/.test(values.count))
      throw new TypeError("count must be an integer.");
    if (values.report && values.count !== undefined)
      throw new TypeError("--report cannot be combined with --count.");
    if (
      values.catalog &&
      (values.seed !== undefined || values.count !== undefined || values.report)
    )
      throw new TypeError(
        "--catalog cannot be combined with seed, count or report.",
      );
    const result = values.catalog
      ? listExcuses(positionals[0])
      : values.report
        ? excuseReport(positionals[0], { seed: values.seed })
        : values.count === undefined
          ? excuse(positionals[0], { seed: values.seed })
          : excuseBatch(positionals[0], {
              seed: values.seed,
              count: Number(values.count),
            });
    console.log(
      values.json
        ? JSON.stringify(result)
        : Array.isArray(result)
          ? result.map((line, i) => `${i + 1}. ${line}`).join("\n")
          : values.report
            ? `${result.excuse}\nNext step: ${result.nextStep}`
            : result,
    );
  }
} catch (error) {
  console.error(`excuse-js: ${error.message}\nRun with --help for usage.`);
  process.exitCode = 2;
}
