import * as api from "@deployanyway/excuse-js";
api.excuseReport("merge-conflict");
api.excuseReport("testing", { seed: 42 });
// @ts-expect-error invalid literal
api.excuse("cow");
import { listExcuses } from "@deployanyway/excuse-js";
listExcuses("testing");
import { incidentUpdate } from "@deployanyway/excuse-js";
incidentUpdate(
  { status: "identified", impact: "Some failures" },
  { audience: "internal", humor: true },
);
// @ts-expect-error unsupported status
incidentUpdate({ status: "probably-fine" });
