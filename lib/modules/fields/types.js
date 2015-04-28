Astronomy.Type({
  name: 'string',
  cast: function(value) {
    return String(value);
  }
});

Astronomy.Type({
  name: 'number',
  cast: function(value) {
    return Number(value);
  }
});

Astronomy.Type({
  name: 'boolean',
  cast: function(value) {
    return Boolean(value);
  }
});

Astronomy.Type({
  name: 'object',
  cast: function(value) {
    return Object(value);
  }
});

Astronomy.Type({
  name: 'array',
  cast: function(value) {
    return value;
  }
});

Astronomy.Type({
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
