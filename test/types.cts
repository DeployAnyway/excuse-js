import api = require("@deployanyway/excuse-js");
api.excuseReport("merge-conflict");
api.excuseReport("testing", { seed: 42 });
// @ts-expect-error invalid literal
api.excuse("cow");
