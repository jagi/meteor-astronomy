Astro.utils = {};

Astro.utils.class = {};

Astro.utils.class.eachClass = function(Class, predicate, context) {
  do {
    if (context) {
      predicate.call(context, Class);
    } else {
      predicate(Class);
    }
  } while (Class = Class.getParent());
};

Astro.utils.class.everyClass = function(Class, predicate, context) {
  do {
    if (context) {
      if (!predicate.call(context, Class)) {
        return false;
      }
    } else {
      if (!predicate(Class)) {
        return false;
      }
    }
  } while (Class = Class.getParent());

  return true;
};

Astro.utils.class.findClass = function(Class, predicate, context) {
  do {
    if (context) {
      if (predicate.call(context, Class)) {
        return Class;
      }
    } else {
      if (predicate(Class)) {
        return Class;
      }
    }
  } while (Class = Class.getParent());
};

Astro.utils.class.findInClass = function(Class, predicate, context) {
  do {
    var value;
    if (context) {
      value = predicate.call(context, Class);
    } else {
      value = predicate(Class);
    }
    if (value) {
      return value;
    }
  } while (Class = Class.getParent());
};

Astro.utils.class.transform = function(className) {
  return function(doc) {
    var transformClassName = className;
    // If there is "_type" attribute in the document, then look for class with
    // name equal to this attribute value. The "_type" attribute is the name
    // of the child class. Stored document is instance of this class.
    if (doc._type && _.has(Astro.classes, doc._type)) {
      // Child class exists, so we will use this class for creating instance.
      transformClassName = doc._type;
    }
    // If document has "_type" attribute and we haven't found class for that
    // name we will use parent class name stored in the "transformClassName" param.

    // Get class from classes list, create instance and return.
    var Class = Astro.classes[transformClassName];
    if (Class) {
      doc = new Class(doc);
      doc._isNew = false;
    }

    // Return plain object, if class does have not been defined.
    return doc;
  };
};
