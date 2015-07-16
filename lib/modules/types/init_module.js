typesOnInitModule = function() {
  Astro.createType({
    name: 'String',
    cast: function(value) {
      return String(value);
    }
  });

  Astro.createType({
    name: 'Number',
    cast: function(value) {
      return Number(value);
    }
  });

  Astro.createType({
    name: 'Boolean',
    cast: function(value) {
      return Boolean(value);
    }
  });

  Astro.createType({
    name: 'Object',
    cast: function(value) {
      if (_.isObject(value)) {
        return value;
      } else {
        return new Object(value);
      }
    }
  });

  Astro.createType({
    name: 'Array',
    cast: function(value) {
      if (_.isArray(value)) {
        return value;
      }

      return [value];
    }
  });

  Astro.createType({
    name: 'Date',
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
};
