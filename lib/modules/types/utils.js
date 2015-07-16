Astro.utils.types = {};

Astro.utils.types.castValue = function(type, value) {
  // We only cast if the type was provided and there is a value to cast.
  if (_.isNull(type) || _.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (_.has(Astro.types, type)) {
    var typeDefinition = Astro.types[type];
    // Only cast the given value if it needs to. If it is already an instance of
    // the given type, then just return this value.
    if (typeDefinition.check(value)) {
      return value;
    } else {
      return typeDefinition.cast(value);
    }
  }

  return value;
};
