Astronomy.transform = function (className) {
  return function (doc) {
    // First, look for the class with the name stored in `_type` property. It's
    // child class name. If it's not found, we will look for `className` class.
    if (doc._type && _.has(Astronomy._classes, doc._type)) {
      // Child class exists, so we will use this class for creating instance.
      className = doc._type;
    }

    // Get class from classes list, create instance and return.
    var Cls = Astronomy._classes[className];
    if (Cls) return new Cls(doc);

    // Return plain object, if class does have not been defined.
    return doc;
  };
};
