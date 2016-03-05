function validateAll(options = {}, callback) {
  let doc = this;
  let Class = doc.constructor;

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(options, Function)) {
    callback = options;
    options = {};
  }

  _.extend(options, {
    fields: Class.getValidationOrder(),
    stopOnFirstError: false
  });

  doc.validate(options, callback);
};

export default validateAll;