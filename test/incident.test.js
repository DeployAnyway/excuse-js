import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { incidentUpdate } from "@deployanyway/excuse-js";
import { Readable } from "node:stream";
import { readStdin } from "../src/input.js";
const now = "2026-10-09T00:00:00Z",
  facts = {
    service: "API",
    status: "identified",
    impact: "Some requests return 503",
    action: "Rolling back the latest release",
    owner: "On-call developer",
    nextUpdate: "2026-10-09T00:15:00Z",
  };
test("public incident updates use supplied facts, omit jokes and expose missing facts", () => {
  const before = JSON.stringify(facts);
  const result = incidentUpdate(facts, { now });
  assert.deepEqual(result.missing, []);
  assert.equal(result.complete, true);
  assert.equal(result.comicRelief, undefined);
  assert.match(result.message, /Some requests return 503/);
  assert.equal(result.overdue, false);
  assert.equal(JSON.stringify(facts), before);
  const missing = incidentUpdate({}, { now });
  assert.deepEqual(missing.missing, [
    "service",
    "impact",
    "action",
    "owner",
    "nextUpdate",
  ]);
  assert.match(missing.message, /Not provided/);
  assert.equal(missing.complete, false);
  assert.doesNotMatch(missing.message, /all customers|resolved|15 minutes/);
  assert.equal(
    incidentUpdate({ ...facts, nextUpdate: "2026-10-08T23:00:00Z" }, { now })
      .overdue,
    true,
  );
  const resolved = incidentUpdate(
    { ...facts, status: "resolved", nextUpdate: null },
    { now },
  );
  assert.ok(!resolved.missing.includes("nextUpdate"));
  assert.equal(resolved.overdue, false);
});
test("internal comic relief is explicit and deterministic; invalid facts/audience never generate a false update", () => {
  const options = { now, audience: "internal", humor: true, seed: "dallas" };
  assert.deepEqual(
    incidentUpdate(facts, options),
    incidentUpdate(facts, options),
  );
  assert.match(incidentUpdate(facts, options).message, /internal only/);
  assert.throws(() => incidentUpdate(facts, { now, humor: true }), TypeError);
  for (const value of [
    null,
    [],
    { status: "fixed" },
    { impact: 2 },
    { owner: "" },
    { nextUpdate: "tomorrow" },
    { nextUpdate: "2026-02-30T00:00:00Z" },
  ])
    assert.throws(() => incidentUpdate(value, { now }));
  for (const options of [
    null,
    { audience: "customers" },
    { humor: "yes" },
    { now: "bad" },
  ])
    assert.throws(() => incidentUpdate(facts, options));
});
test("incident CLI accepts bounded JSON stdin and keeps public output joke-free", () => {
  const run = (args) =>
    spawnSync(process.execPath, ["bin/cli.js", ...args], {
      input: JSON.stringify(facts),
      encoding: "utf8",
    });
  const cli = run(["--incident", "--now", now, "--json"]);
  assert.equal(cli.status, 0, cli.stderr);
  assert.equal(JSON.parse(cli.stdout).comicRelief, undefined);
  assert.equal(run(["--incident", "--humor"]).status, 2);
  assert.equal(run(["--incident", "--catalog"]).status, 2);
  assert.equal(run(["--audience", "internal"]).status, 2);
  assert.equal(run(["--incident", "--require-complete"]).status, 0);
  const incomplete = spawnSync(
    process.execPath,
    ["bin/cli.js", "--incident", "--require-complete"],
    { input: "{}", encoding: "utf8" },
  );
  assert.equal(incomplete.status, 1, incomplete.stderr);
});
test("incident input bounds bytes and preserves UTF-8 across chunks", async () => {
  const bytes = Buffer.from('{"service":"Dallas 🐺"}');
  assert.equal(
    await readStdin(Readable.from([bytes.subarray(0, 21), bytes.subarray(21)])),
    bytes.toString(),
  );
  await assert.rejects(readStdin({ isTTY: true }), /Pipe/);
  await assert.rejects(readStdin(Readable.from(["  "])), /Provide/);
  await assert.rejects(
    readStdin(Readable.from([Buffer.alloc(262145)])),
    /256 KiB/,
  );
});
