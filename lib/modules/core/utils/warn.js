import config from '../../../core/config.js';

function warn(warning) {
  if (console && console.warn && config.verbose) {
    console.warn(warning);
  }
};

export default warn;