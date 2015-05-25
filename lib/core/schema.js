Astro.Schema = function(schemaDefinition) {
  this.className = schemaDefinition.name;

  // Set collection for schema.
  if (_.has(schemaDefinition, 'collection')) {
    this.collection = schemaDefinition.collection;

    // If there is not "transform" property then set it to true by default.
    if (!_.has(schemaDefinition, 'transform')) {
      schemaDefinition.transform = true;
    }

    // Set document transformation, if "transform" flag is set.
    if (schemaDefinition.transform) {
      this.collection._transform = LocalCollection.wrapTransform(
        Astro.utils.transform(this.className)
      );
    }
  }

  // Set the class to extend from.
  if (_.has(schemaDefinition, 'parentClassName')) {
    this.parentClassName = schemaDefinition.parentClassName;
  }

  // Set constructor for class.
  this.init = function(attrs) {
    var self = this;
    var args = arguments;

    // Setup instance using "initinstance" event handlers.
    Astro.eventManager.each('initinstance', function(eventHandler) {
      eventHandler.apply(self, args);
    });

    // Call user constructor if defined.
    if (_.isFunction(schemaDefinition.init)) {
      schemaDefinition.init.apply(this, args);
    }
  };

  // Extend.
  var Class = Astro.classes[this.className];
  var ParentClass = Astro.classes[this.parentClassName];
  // Extend another model class if provided.
  if (ParentClass) {
    Class.prototype = Object.create(ParentClass.prototype);
  } else {
    Class.prototype = Object.create(Astro.BaseClass.prototype);
  }
  Class.prototype.constructor = Class;
};
