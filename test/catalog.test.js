import { URL } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { listExcuses } from "../src/index.js";
test("category catalogs are normalized, independent and usable from CLI", () => {
  const list = listExcuses(" TESTING ");
  assert.equal(list.length, 12);
  list.pop();
  assert.equal(listExcuses("testing").length, 12);
  assert.equal(listExcuses().length, 12);
  for (const category of [null, 1, "", " "])
    assert.throws(() => listExcuses(category), TypeError);
  for (const category of ["constructor", "missing"])
    assert.throws(() => listExcuses(category), RangeError);
  const run = (args) =>
    spawnSync(process.execPath, ["bin/cli.js", ...args], {
      cwd: new URL("..", import.meta.url),
      encoding: "utf8",
    });
  const output = run(["testing", "--catalog", "--json"]);
  assert.equal(output.status, 0);
  assert.deepEqual(JSON.parse(output.stdout), listExcuses("testing"));
  assert.equal(run(["--catalog", "--seed", "x"]).status, 2);
  assert.equal(run(["--catalog", "--report"]).status, 2);
  assert.equal(run(["--catalog", "--list"]).status, 2);
  assert.match(run(["testing", "--catalog"]).stdout, /12\./);
});
