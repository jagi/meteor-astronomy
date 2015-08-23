Astro.utils = {};

Astro.utils.class = {};

Astro.utils.class.transform = function(transformFunction) {
  return LocalCollection.wrapTransform(transformFunction);
};

Astro.utils.class.transformToClass = function(Collection) {
  return LocalCollection.wrapTransform(function(attrs) {
    var collectionInfo = Astro.getCollectionInfo(Collection);
    if (collectionInfo) {
      if (collectionInfo.classes.length > 1) {
        var typeField = collectionInfo.typeField || 'type';
        Class = Astro.getClass(attrs[typeField]);
      } else {
        Class = Astro.getClass(collectionInfo.classes[0]);
      }

      var doc = new Class(attrs);
      doc._isNew = false;
      return doc;
    }

    return attrs;
  });
};
