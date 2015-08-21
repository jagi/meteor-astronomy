var Field = Astro.Field;

var EmbedManyField =
Astro.EmbedManyField = function EmbedManyField(definition) {
  Field.apply(this, arguments);

  this.class = _.isUndefined(definition.class) ? null : definition.class;
};

EmbedManyField.prototype = Object.create(Astro.Field.prototype);
EmbedManyField.prototype.constructor = EmbedManyField;

EmbedManyField.prototype.getDefault = function() {
  return [];
};

EmbedManyField.prototype.cast = function(array) {
  var self = this;

  if (_.isArray(array)) {
    _.each(array, function(value, index) {
      var Class = Astro.classes[self.class];
      array[index] = new Class(value);
    });
    return array;
  }
  return [];
};
