Astro.utils.types = {};

Astro.utils.types.castValue = function(type, value) {
  // We only cast value if it's not null or undefined and the type is defined.
  if (type && !_.isUndefined(value) && !_.isNull(value)) {
    value = Astro.types[type](value);
  }

  return value;
};
