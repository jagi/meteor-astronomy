import config from "../../../core/config";
import warn from "./warn";

function deprecated(message) {
  // Be silent and do not log any warnings.
  if (!config.verbose || !config.logs.deprecation) {
    return;
  }
  // Print message to the console.
  warn(`Deprecation warning: ${message}`);
}

export default deprecated;
