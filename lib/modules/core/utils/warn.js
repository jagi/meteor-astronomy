import config from '../../../core/config.js';

function warn(warning) {
  // Be silent and do not log any warnings.
  if (!config.verbose) {
    return;
  }
  try {
    console.warn(warning);
  }
  catch (e) {
  }
};

export default warn;