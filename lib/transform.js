Astronomy.transform = function(className) {
  return function(doc) {
    // If there is `_class` attribute in the document, then look for class with
    // name equal to this attribute value. The `_class` attribute is the name
    // of the child class. Stored document is instance of this class.
    if (doc._class && _.has(Astronomy._classes, doc._class)) {
      // Child class exists, so we will use this class for creating instance.
      className = doc._class;
    }
    // If document has `_class` attribute and we haven't found class for that
    // name we will use parent class name stored in the `className` param.

    // Get class from classes list, create instance and return.
    var Class = Astronomy._classes[className];
    if (Class) {
      return new Class(doc);
    }

    // Return plain object, if class does have not been defined.
    return doc;
  };
};
