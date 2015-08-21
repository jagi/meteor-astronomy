Astro.registerType({
  name: 'null',
  cast: function(value) {
    return value;
  },
  plain: function(value, fieldDefinition) {
    return value;
  }
});

Astro.registerType({
  name: 'string',
  cast: function(value) {
    if (_.isString(value)) {
      return value;
    }
    return String(value);
  },
  plain: function(value, fieldDefinition) {
    return value.valueOf();
  }
});

Astro.registerType({
  name: 'number',
  cast: function(value) {
    if (_.isNumber(value)) {
      return value;
    }
    return Number(value);
  },
  plain: function(value, fieldDefinition) {
    return value.valueOf();
  }
});

Astro.registerType({
  name: 'boolean',
  cast: function(value) {
    if (_.isBoolean(value)) {
      return value;
    }
    return Boolean(value);
  },
  plain: function(value, fieldDefinition) {
    return value.valueOf();
  }
});

Astro.registerType({
  name: 'date',
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
  },
  plain: function(value, fieldDefinition) {
    return value;
  }
});
