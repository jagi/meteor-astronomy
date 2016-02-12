let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.getModified = function(old) {
  let doc = this;

  return Astro.utils.storage.getModified({ doc, transient: true });
};