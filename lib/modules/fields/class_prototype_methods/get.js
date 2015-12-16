let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods.get = function() {
  let doc = this;
  let utils = Astro.utils.fields;
  let args = arguments;

  if (args.length === 0) {
    return utils.getAll(doc);
  } else if (args.length === 1) {
    if (args[0] instanceof Array) {
      return utils.getMany(doc, args[0]);
    } else if (typeof args[0] === 'string') {
      return utils.getOne(doc, args[0]);
    }
  }
};