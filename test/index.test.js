import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import { excuse, categories } from "@deployanyway/excuse-js";
import { phrases } from "../src/excuses.js";

const cliPath = fileURLToPath(new URL("../bin/cli.js", import.meta.url));
const cli = (...args) =>
  spawnSync(process.execPath, [cliPath, ...args], { encoding: "utf8" });

test("public category list is complete and independent", () => {
  assert.deepEqual(categories(), [
    "deployment",
    "build",
    "production",
    "bug",
    "api",
    "database",
    "deadline",
    "testing",
    "network",
    "merge-conflict",
    "demo",
  ]);
  categories().pop();
  assert.equal(categories().length, 11);
});
for (const category of Object.keys(phrases)) {
  test(`${category} catalog and selection`, () => {
    assert.ok(phrases[category].length >= 3);
    assert.ok(
      phrases[category].every(
        (text) => typeof text === "string" && text.trim().length > 15,
      ),
    );
    assert.equal(new Set(phrases[category]).size, phrases[category].length);
    for (let i = 0; i < 20; i++) {
      assert.ok(phrases[category].includes(excuse(category)));
      assert.ok(phrases[category].includes(excuse(category, { seed: i })));
    }
  });
}
test("all phrases are unique across categories", () => {
  const all = Object.values(phrases).flat();
  assert.equal(new Set(all).size, 33);
});
test("default and normalized categories", () => {
  assert.ok(phrases.deployment.includes(excuse()));
  assert.equal(excuse(" API ", { seed: "x" }), excuse("api", { seed: "x" }));
});
test("seeded output is stable, stateless, and reaches multiple choices", () => {
  for (const seed of ["", "demo", 0, -1, 1.5, "🐶"]) {
    const result = excuse("bug", { seed });
    excuse("network");
    assert.equal(excuse("bug", { seed }), result);
  }
  assert.ok(
    new Set(Array.from({ length: 30 }, (_, seed) => excuse("bug", { seed })))
      .size > 1,
  );
  // Golden fixture catches accidental algorithm or catalog changes.
  assert.equal(
    excuse("bug", { seed: "demo" }),
    "The bug declined to reproduce until the screen-sharing session began.",
  );
});
test("invalid inputs and prototype keys", () => {
  for (const category of [null, 1, {}, [], "", " "])
    assert.throws(() => excuse(category), TypeError);
  for (const category of ["unknown", "__proto__", "constructor", "toString"])
    assert.throws(() => excuse(category), RangeError);
  for (const seed of [null, NaN, Infinity, {}, [], true])
    assert.throws(() => excuse("bug", { seed }), TypeError);
  for (const options of [null, [], 1])
    assert.throws(() => excuse("bug", options), TypeError);
});
test("CLI help, version, list, default, and seed agreement", () => {
  assert.equal(cli("--help").status, 0);
  assert.ok(cli("--help").stdout.includes("Usage:"));
  assert.equal(cli("--version").stdout.trim(), "0.1.0");
  assert.deepEqual(cli("--list").stdout.trim().split(/\r?\n/), categories());
  assert.equal(cli().status, 0);
  assert.ok(phrases.deployment.includes(cli().stdout.trim()));
  const result = cli("API", "--seed", "demo");
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), excuse("api", { seed: "demo" }));
});
test("CLI invalid arguments have exit 2 and stderr", () => {
  for (const args of [
    ["unknown"],
    ["bug", "demo"],
    ["--wat"],
    ["--seed"],
    ["--list", "bug"],
    ["--list", "--seed", "x"],
  ]) {
    const result = cli(...args);
    assert.equal(result.status, 2);
    assert.equal(result.stdout, "");
    assert.ok(result.stderr.includes("--help"));
  }
});
