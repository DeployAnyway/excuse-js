import { URL } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { excuseReport, excuse, categories } from "../src/index.js";
const cli = (...args) =>
  spawnSync(process.execPath, ["bin/cli.js", ...args], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
test("every category has a repeatable joke plus an honest next step", () => {
  for (const category of categories()) {
    const result = excuseReport(category, { seed: 42 });
    assert.equal(result.excuse, excuse(category, { seed: 42 }));
    assert.equal(result.category, category);
    assert.ok(result.nextStep.length > 20);
  }
  assert.equal(excuseReport().category, "deployment");
  assert.equal(excuseReport(" TESTING ").category, "testing");
  assert.throws(() => excuseReport("cow"), RangeError);
  assert.throws(() => excuseReport("build", null), TypeError);
});
test("CLI report output and mutually exclusive options", () => {
  const result = cli("testing", "--report", "--seed", "42", "--json");
  assert.equal(result.status, 0);
  assert.deepEqual(
    JSON.parse(result.stdout),
    excuseReport("testing", { seed: "42" }),
  );
  assert.ok(cli("testing", "--report").stdout.includes("Next step:"));
  assert.equal(cli("--list", "--report").status, 2);
  assert.equal(cli("--report", "--count", "2").status, 2);
});
