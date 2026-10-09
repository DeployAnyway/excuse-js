import { readFileSync } from "node:fs";
import { incidentUpdate } from "@deployanyway/excuse-js";
try {
  const facts = process.argv[2]
    ? JSON.parse(readFileSync(process.argv[2], "utf8"))
    : {};
  const draft = incidentUpdate(facts);
  console.log(draft.message);
  process.exitCode = draft.complete ? 0 : 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
