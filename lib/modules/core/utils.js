Astro.utils = {};

Astro.utils.warn = function(warning) {
  if (console && console.warn && Astro.config.verbose) {
    console.warn(warning);
  }
};

Astro.utils.string = {};

Astro.utils.string.ucfirst = function(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
};

Astro.utils.object = {};

Astro.utils.object.deepMerge = function(target, source, key) {
  var self = this;

  var mergeKey = function(key) {
    var targetValue = target[key];
    var sourceValue = source[key];

    if (_.has(target, key)) {
      result[key] = self.deepMerge(targetValue, sourceValue, key);
    } else {
      if (
        _.isObject(sourceValue) &&
        !_.isArray(sourceValue) &&
        !_.isFunction(sourceValue)
      ) {
        result[key] = self.deepMerge({}, sourceValue, key);
      } else {
        result[key] = sourceValue;
      }
    }
  };

  if (_.isArray(source) && _.isArray(target)) {
    return [].concat(target, source);
  } else if (_.isObject(target) && _.isObject(source)) {
    var result = _.extend({}, target);
    _.each(_.keys(source), mergeKey);
    return result;
  } else {
    return source;
  }
};

Astro.utils.class = {};

Astro.utils.class.transform = function(transformFunction) {
  return LocalCollection.wrapTransform(transformFunction);
};

Astro.utils.class.transformToClass = function(className) {
  return LocalCollection.wrapTransform(function(attrs) {
    var Class = Astro.getClass(className);

    if (Class) {
      var typeField = Class.getTypeField();
      if (typeField) {
        var TypeClass = Astro.getClass(attrs[typeField]);
        if (TypeClass) {
          Class = TypeClass;
        }
      }

      var doc = new Class(attrs);
      doc._isNew = false;
      return doc;
    }

    return attrs;
  });
};

Astro.utils.class.inherits = function(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
};
