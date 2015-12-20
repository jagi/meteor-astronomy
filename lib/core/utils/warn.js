Astro.utils.core.warn = function(warning) {
  if (console && console.warn && Astro.config.verbose) {
    console.warn(warning);
  }
};