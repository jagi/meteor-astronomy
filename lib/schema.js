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
        Astro.Utils.transform(this.className)
      );
    }
  }

  // Set the class to extend from.
  if (_.has(schemaDefinition, 'parentClassName')) {
    this.parentClassName = schemaDefinition.parentClassName;
  }

  // Set constructor for class.
  this.init = function(attrs) {
    var args = arguments;

    // Setup instance using modules.
    _.each(Modules, function(Module) {
      if (_.isFunction(Module.oninitinstance)) {
        Module.oninitinstance.apply(this, args);
      }
    }, this);

    // Call user constructor if defined.
    if (_.isFunction(schemaDefinition.init)) {
      schemaDefinition.init.apply(this, args);
    }
  };

  // Extend.
  var Class = Classes[this.className];
  var ParentClass = Classes[this.parentClassName];
  // Extend another model class if provided.
  if (ParentClass) {
    Class.prototype = Object.create(ParentClass.prototype);
  } else {
    Class.prototype = Object.create(Astro.BaseClass.prototype);
  }
  Class.prototype.constructor = Class;
};
