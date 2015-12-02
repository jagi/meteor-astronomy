let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.isModified = function() {
  let doc = this;

  // Check an amount of modified fields.
  return _.size(doc.getModified()) > 0;
};
