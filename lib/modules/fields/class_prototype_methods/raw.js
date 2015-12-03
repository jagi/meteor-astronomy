let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods.raw = function() {
  let doc = this;

  if (arguments.length === 0) {
    return doc._rawAll();
  } else if (arguments.length === 1) {
    if (arguments[0] instanceof Array) {
      return doc._rawMany(arguments[0]);
    } else if (typeof arguments[0] === 'string') {
      return doc._rawOne(arguments[0]);
    }
  }
};