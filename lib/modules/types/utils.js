Astro.utils.types = {};

Astro.utils.types.castValue = function(type, value) {
  // We only cast value if the type was provided.
  if (!_.isNull(type) && !_.isUndefined(value) && !_.isNull(value)) {
    value = Astro.types[type](value);
  }

  return value;
};

Astro.utils.types.displayValue = function(type, value) {
  // We only format value if the type was provided.
  if (!_.isNull(type) && Astro.displays[type] && !_.isUndefined(value) && !_.isNull(value)) {
    value = Astro.displays[type](value);
  }

  return value;
};
