let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.isModified = function(pattern) {
  let doc = this;

  return Astro.utils.storage.isModified({ doc, pattern, transient: true });
};
