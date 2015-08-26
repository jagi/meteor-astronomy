Astro.utils = {};

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
