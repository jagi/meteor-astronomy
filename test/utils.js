reset = function() {
  Astro.Class.classes = {};
};

removeAll = function(Collection) {
  Collection.find({}, {
    transform: null
  }).forEach(function(doc) {
    Collection.remove(doc._id);
  });
};
