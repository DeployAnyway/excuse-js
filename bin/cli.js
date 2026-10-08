#!/usr/bin/env node
import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { excuse, categories } from "../src/index.js";

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      seed: { type: "string" },
      list: { type: "boolean" },
    },
  });
  if (values.help) {
    console.log(
      "Usage: excuse-js [category] [--seed text]\n\nDefault category: deployment\n\nOptions:\n  --seed text    Repeatable selection (always a string seed)\n  --list         List categories\n  -h, --help     Show help\n  -v, --version  Show version\n\nExample: excuse-js deployment --seed demo\nExit codes: 0 success; 2 invalid arguments.",
    );
  } else if (values.version) {
    console.log(
      JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8"),
      ).version,
    );
  } else if (values.list) {
    if (positionals.length || values.seed !== undefined)
      throw new TypeError("--list does not accept a category or seed.");
    console.log(categories().join("\n"));
  } else {
    if (positionals.length > 1)
      throw new TypeError("Provide only one category.");
    console.log(excuse(positionals[0], { seed: values.seed }));
  }
} catch (error) {
  console.error(`excuse-js: ${error.message}\nRun with --help for usage.`);
  process.exitCode = 2;
}
