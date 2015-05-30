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
        Astro.utils.class.transform(this.className)
      );
    }
  }

  // Set the class to extend from.
  if (_.has(schemaDefinition, 'parentClassName')) {
    this.parentClassName = schemaDefinition.parentClassName;
  }

  // Set class constructor.
  this.init = function() {
    // Call init (constructor) method if provided by user.
    if (_.isFunction(schemaDefinition.init)) {
      schemaDefinition.init.apply(this, arguments);
    }
  };
};
