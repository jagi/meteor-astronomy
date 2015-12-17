reset = function() {
  _.each(Astro.Class.classes, function(Class) {
    let Collection = Class.getCollection();
    if (!Collection) {
      return;
    }

    // Remove documents from the collection.
    Collection.find().forEach(function(doc) {
      Collection.remove(doc._id);
    });
  });

  Astro.Class.classes = {};
};