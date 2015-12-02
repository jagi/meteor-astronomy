Astro.utils.storage.transformToClass = function(className) {
  return function(attrs) {
    if (!Astro.config.enabled) {
      return attrs;
    }

    var Class = Astro.Class.get(className);

    if (Class) {
      var typeField = Class.getTypeField();
      if (typeField) {
        var TypeClass = Astro.Class.get(attrs[typeField]);
        if (TypeClass) {
          Class = TypeClass;
        }
      }

      var doc = new Class(attrs);
      doc._isNew = false;
      return doc;
    }

    return attrs;
  };
};