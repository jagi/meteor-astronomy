let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods.set = function() {
  var doc = this;

  if (arguments.length === 1 && _.isObject(arguments[0])) {
    doc._setMany(arguments[0]);
  } else if (arguments.length === 2 && typeof arguments[0] === 'string') {
    doc._setOne(arguments[0], arguments[1]);
  }
};