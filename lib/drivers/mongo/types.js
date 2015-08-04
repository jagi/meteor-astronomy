Astro.registerType({
  name: 'String',
  cast: function(value) {
    if (_.isString(value)) {
      return value;
    }
    return String(value);
  }
});

Astro.registerType({
  name: 'Number',
  cast: function(value) {
    if (_.isNumber(value)) {
      return value;
    }
    return Number(value);
  }
});

Astro.registerType({
  name: 'Boolean',
  cast: function(value) {
    if (_.isBoolean(value)) {
      return value;
    }
    return Boolean(value);
  }
});

Astro.registerType({
  name: 'Object',
  cast: function(value) {
    if (_.isObject(value)) {
      return value;
    }
    return new Object(value);
  }
});

Astro.registerType({
  name: 'Array',
  cast: function(values, fieldDefinition) {
    if (_.isArray(values)) {
      if (fieldDefinition && fieldDefinition.nestedType) {
        _.each(values, function(value, index) {
          var nestedTypeDefinition = Astro.types[fieldDefinition.nestedType];
          values[index] = nestedTypeDefinition.cast(value);
        });
      }
      return values;
    }
    return [];
  }
});

Astro.registerType({
  name: 'Date',
  cast: function(value) {
    if (_.isDate(value)) {
      return value;
    } else if (_.isString(value)) {
      var date = Date.parse(value);
      if (!_.isNaN(date)) {
        return new Date(date);
      } else {
        return null;
      }
    } else if (_.isNumber(value)) {
      return new Date(value);
    }
    return null;
  }
});
