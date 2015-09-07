typesOnInitModule = function() {
  Astro.createType({
    name: 'string',
    cast: function(value) {
      return String(value);
    }
  });

  Astro.createType({
    name: 'number',
    cast: function(value) {
      return Number(value);
    }
  });

  Astro.createType({
    name: 'boolean',
    cast: function(value) {
      return Boolean(value);
    }
  });

  Astro.createType({
    name: 'object',
    cast: function(value) {
      return new value.constructor(value);
    }
  });

  Astro.createType({
    name: 'array',
    cast: function(value) {
      if (_.isArray(value)) {
        return value;
      }

      return [value];
    }
  });

  Astro.createType({
    name: 'date',
    cast: function(value) {
      return new Date(value);
    }
  });
};
