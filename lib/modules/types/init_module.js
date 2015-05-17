typesOnInitModule = function() {
  Astro.Type({
    name: 'string',
    cast: function(value) {
      return String(value);
    }
  });

  Astro.Type({
    name: 'number',
    cast: function(value) {
      return Number(value);
    }
  });

  Astro.Type({
    name: 'boolean',
    cast: function(value) {
      return Boolean(value);
    }
  });

  Astro.Type({
    name: 'object',
    cast: function(value) {
      return value;
    }
  });

  Astro.Type({
    name: 'array',
    cast: function(value) {
      if (_.isArray(value)) {
        return value;
      }

      return [value];
    }
  });

  Astro.Type({
    name: 'date',
    cast: function(value) {
      if (_.isString(value)) {
        var date = Date.parse(value);
        if (!_.isNaN(date)) {
          return new Date(date);
        }
      } else if (_.isNumber(value)) {
        return new Date(value);
      } else {
        return value;
      }
    }
  });
};
