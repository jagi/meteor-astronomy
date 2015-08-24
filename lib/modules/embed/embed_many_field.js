var Field = Astro.Field;

var EmbedManyField =
Astro.EmbedManyField = function EmbedManyField(definition) {
  Field.apply(this, arguments);

  this.class = _.isUndefined(definition.class) ? null : definition.class;
};

EmbedManyField.prototype = Object.create(Astro.Field.prototype);
EmbedManyField.prototype.constructor = EmbedManyField;

EmbedManyField.prototype.cast = function(array) {
  var self = this;

  if (_.isUndefined(array) || _.isNull(array)) {
    return array;
  }

  if (_.isArray(array)) {
    if (self.class) {
      var Class = Astro.classes[self.class];
      if (!Class) {
        throw new Error('The "' + self.class + '" class does not exist');
      }
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

  if (_.isUndefined(array) || _.isNull(array)) {
    return array;
  }

  if (self.class) {
    var Class = Astro.classes[self.class];
    if (!Class) {
      throw new Error('The "' + self.class + '" class does not exist');
    }
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
