Astro.eventManager.on('initClass', function() {
  var Class = this;

  // Add the class as a new type.
  Astro.registerType({
    name: Class.getName(),
    cast: function(value) {
      // If the "value" argument is already of the given type, then just return
      // the "value" argument.
      if (value instanceof Class) {
        return value;
      }
      // Otherwise, try creating an instance of the given class.
      return new Class(value);
    },
    plain: function(value) {
      return value.get();
    },
    isNested: true
  });
});
