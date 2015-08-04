Astro.utils.types = {};

Astro.utils.types.castValue = function(value, fieldDefinition) {
  // We only cast if the type had been provided and there is a value to cast.
  if (
    _.isNull(fieldDefinition.type) || _.isUndefined(value) || _.isNull(value)
  ) {
    return value;
  }

  return fieldDefinition.type.cast(value, fieldDefinition);
};

Astro.utils.types.getPlainValue = function(value, fieldDefinition) {
  // We only get a plain value if it's not an empty value.
  if (
    _.isNull(fieldDefinition.type) || _.isUndefined(value) || _.isNull(value)
  ) {
    return value;
  }

  return fieldDefinition.type.plain(value, fieldDefinition);
};
