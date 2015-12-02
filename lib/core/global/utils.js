Astro.utils = {};

Astro.utils.warn = function(warning) {
  if (console && console.warn && Astro.config.verbose) {
    console.warn(warning);
  }
};

