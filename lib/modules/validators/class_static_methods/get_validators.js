let methods = Astro.Module.modules.validators.classStaticMethods;

methods.getValidators = function(fieldName) {
  if (!Match.test(fieldName, Match.Optional(String))) {
    throw TypeError(
      'The first argument of the "getValidators" function has to be a string ' +
      'or left empty'
    );
  }

  if (fieldName) {
    return this.schema.validators[fieldName];
  }
  else {
    return this.schema.validators;
  }
};