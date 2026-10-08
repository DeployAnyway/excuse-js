import { URL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { excuseBatch, excuse, categories } from "../src/index.js";
test("seeded batches are stable, independent, and cycle only after pool exhaustion", () => {
  for (const category of categories()) {
    const batch = excuseBatch(category, { count: 6, seed: "demo" });
    assert.equal(new Set(batch.slice(0, 3)).size, 3);
    assert.equal(batch[0], batch[3]);
    assert.equal(batch[0], excuse(category, { seed: "demo" }));
    batch[0] = "changed";
    assert.notEqual(excuseBatch(category, { seed: "demo" })[0], "changed");
  }
  const cli = spawnSync(
    process.execPath,
    ["bin/cli.js", "deployment", "--count", "3", "--seed", "demo", "--json"],
    { cwd: new URL("..", import.meta.url), encoding: "utf8" },
  );
  assert.equal(cli.status, 0);
  assert.deepEqual(
    JSON.parse(cli.stdout),
    excuseBatch("deployment", { seed: "demo" }),
  );
});
test("batch rejects invalid counts, seeds, and categories", () => {
  for (const count of [0, 21, 1.5, NaN, "3"])
    assert.throws(() => excuseBatch("deployment", { count }), RangeError);
  assert.throws(() => excuseBatch("missing"), RangeError);
  assert.throws(() => excuseBatch("deployment", { seed: null }), TypeError);
});
