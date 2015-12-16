let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods.set = function() {
  let doc = this;
  let utils = Astro.utils.fields;
  let args = arguments;

  if (args.length === 1 && _.isObject(args[0])) {
    utils.setMany(doc, args[0]);
  } else if (args.length === 2 && typeof args[0] === 'string') {
    utils.setOne(doc, args[0], args[1]);
  }
};