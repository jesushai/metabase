import { trackSchemaEvent } from "metabase/lib/analytics";
import { STEPS } from "./constants";

export const trackStepSeen = stepNumber => {
  trackSchemaEvent("setup", "1-0-0", {
    event: "step_seen",
    version: "1.0.0",
    step: STEPS[stepNumber],
    step_number: stepNumber,
  });
};

export const trackDatabaseSelected = database => {
  trackSchemaEvent("setup", "1-0-0", {
    event: "database_selected",
    version: "1.0.0",
    database,
  });
};

export const trackAddDataLaterClicked = database => {
  trackSchemaEvent("setup", "1-0-0", {
    event: "add_data_later_clicked",
    version: "1.0.0",
    source: database ? "post_selection" : "pre_selection",
  });
};
