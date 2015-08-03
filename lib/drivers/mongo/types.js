Astro.registerType({
  name: 'String',
  check: _.isString,
  cast: function(value) {
    return String(value);
  }
});

Astro.registerType({
  name: 'Number',
  check: _.isNumber,
  cast: function(value) {
    return Number(value);
  }
});

Astro.registerType({
  name: 'Boolean',
  check: _.isBoolean,
  cast: function(value) {
    return Boolean(value);
  }
});

Astro.registerType({
  name: 'Object',
  check: _.isObject,
  cast: function(value) {
    if (_.isObject(value)) {
      return value;
    } else {
      return new Object(value);
    }
  }
});

Astro.registerType({
  name: 'Array',
  check: function(values, fieldDefinition) {
    if (!_.isArray(values)) {
      return false;
    }

    if (fieldDefinition.nestedType) {
      // return _.every(values, function(value, i) {
      //   var nestedTypeDefinition = Astro.types[fieldDefinition.nestedType];
      //   return nestedTypeDefinition.check(value);
      // });
    }

    return true;
  },
  cast: function(values, fieldDefinition) {
    console.log('cast array', values);
    if (_.isArray(values)) {
      return values;
    }

    return [values];
  }
});

Astro.registerType({
  name: 'Date',
  check: _.isDate,
  cast: function(value) {
    if (_.isString(value)) {
      var date = Date.parse(value);
      if (!_.isNaN(date)) {
        return new Date(date);
      } else {
        return null;
      }
    } else if (_.isNumber(value)) {
      return new Date(value);
    } else {
      return value;
    }
  }
});
