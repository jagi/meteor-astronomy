Astro.utils.types = {};

Astro.utils.types.castValue = function(value, fieldDefinition) {
  // We only cast if the type had been provided and there is a value to cast.
  if (
    _.isNull(fieldDefinition.type) || _.isUndefined(value) || _.isNull(value)
  ) {
    return value;
  }

  if (_.has(Astro.types, fieldDefinition.type)) {
    var typeDefinition = Astro.types[fieldDefinition.type];
    // Only cast the given value if it needs to. If it is already an instance of
    // the given type, then just return this value.
    if (typeDefinition.check(value, fieldDefinition)) {
      return value;
    } else {
      return typeDefinition.cast(value, fieldDefinition);
    }
  }

  return value;
};
