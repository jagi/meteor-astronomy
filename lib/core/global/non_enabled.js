Astro.nonEnabled = function(func) {
  let enabled = this.config.enabled;
  this.config.enabled = false;
  func();
  this.config.enabled = enabled;
};