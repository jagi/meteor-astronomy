import config from '../../../core/config';

function deprecated(message) {
  // Be silent and do not log any warnings.
  if (!config.verbose) {
    return;
  }
  // Check if there is the "warn" console function.
  const warn = console && console.warn;
  if (!warn) {
    return;
  }
  // Print message to the console.
  warn(`Deprecation warning: ${message}`);
}

export default deprecated;