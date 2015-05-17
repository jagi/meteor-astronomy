Astro.Utils = {};

Astro.Utils.eachClass = function(Class, predicate, context) {
  do {
    if (context) {
      predicate.call(context, Class);
    } else {
      predicate(Class);
    }
  } while (Class = Class.getParent());
};

Astro.Utils.everyClass = function(Class, predicate, context) {
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

Astro.Utils.findClass = function(Class, predicate, context) {
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

Astro.Utils.findInClass = function(Class, predicate, context) {
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
