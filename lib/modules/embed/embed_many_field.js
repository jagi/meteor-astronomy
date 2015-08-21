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
    if (self.class) {
      var Class = Astro.classes[self.class];

      _.each(array, function(value, index) {
        if (value instanceof Class) {
          array[index] = value;
        } else {
          array[index] = new Class(value);
        }
      });
    }
  } else {
    array = [];
  }

  return array;
};

EmbedManyField.prototype.plain = function(array) {
  var self = this;

  if (self.class) {
    var Class = Astro.classes[self.class];

    _.each(array, function(value, index) {
      if (value instanceof Class) {
        array[index] = Astro.utils.fields.getAllValues(value, {
          cast: false,
          default: false
        });
      } else {
        array[index] = value.valueOf();
      }
    });
  } else {
    array = array.valueOf();
  }

  return array;
};
