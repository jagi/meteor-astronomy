Astro.utils.types = {};

Astro.utils.types.castValue = function(type, value) {
  // We only cast if the type was provided and there is a value to cast.
  if (_.isNull(type) || _.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (_.has(Astro.types, type)) {
    return Astro.types[type](value);
  }

  return value;
};
