import Config from '../config.js';

function warn(warning) {
  if (console && console.warn && Config.verbose) {
    console.warn(warning);
  }
};

export default warn;