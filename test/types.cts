import api = require("@deployanyway/excuse-js");
api.excuseReport("merge-conflict");
api.excuseReport("testing", { seed: 42 });
// @ts-expect-error invalid literal
api.excuse("cow");
api.listExcuses("testing");
import incident = require("@deployanyway/excuse-js");
incident.incidentUpdate({ owner: "on-call" }).missing;
