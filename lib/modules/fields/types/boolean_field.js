Astro.createType({
  name: 'boolean',
  constructor: function BooleanField() {
    Astro.BaseField.apply(this, arguments);
  },
  needsCast: function(value) {
    return !_.isBoolean(value);
  },
  cast: function(value) {
  	if (_.isString(value) && value.toLowerCase() === 'false') {
  		value = 0;
  	}
    return Boolean(value);
  }
});
