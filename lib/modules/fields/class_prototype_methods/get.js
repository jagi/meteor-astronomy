let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods.get = function() {
  let doc = this;

  if (arguments.length === 0) {
    return doc._getAll();
  } else if (arguments.length === 1) {
    if (arguments[0] instanceof Array) {
      return doc._getMany(arguments[0]);
    } else if (typeof arguments[0] === 'string') {
      return doc._getOne(arguments[0]);
    }
  }
};