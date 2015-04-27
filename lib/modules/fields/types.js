Astronomy.Type({
  name: 'String',
  cast: function(value) {
    return String(value);
  }
});

Astronomy.Type({
  name: 'Number',
  cast: function(value) {
    return Number(value);
  }
});

Astronomy.Type({
  name: 'Boolean',
  cast: function(value) {
    return Boolean(value);
  }
});

Astronomy.Type({
  name: 'Object',
  cast: function(value) {
    return Object(value);
  }
});

Astronomy.Type({
  name: 'Array',
  cast: function(value) {
    return value;
  }
});

Astronomy.Type({
  name: 'Date',
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
