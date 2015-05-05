Astronomy.Module({
  name: 'Fields',
  initClass: function() {
    this.prototype.set = methods.set;
    this.prototype.get = methods.get;
    this.prototype.getModified = methods.getModified;
    this.prototype.save = methods.save;
    this.prototype.remove = methods.remove;
    this.prototype.reload = methods.reload;
    this.prototype.clone = methods.clone;
  },
  initSchema: function(Class, definition) {
    // Check if fields definition is provided.
    if (!_.has(definition, 'fields')) {
      throw new Error('The fields definition has to be provided');
    }
    if (_.size(definition.fields) === 0) {
      throw new Error('At least one field has to be defined');
    }

    this._fields = {};

    // Mandatory "_id" field.
    this.addField('_id', {
      type: 'string',
      default: undefined
    });

    if (this.getParentClass()) {
      // Add field for storing child class name.
      this.addField('_type', {
        type: 'string',
        default: this.getName()
      });
    }

    this.addFields(definition.fields);
  },
  initInstance: function(attrs) {
    // Create empty object per instance for storing object's values.
    this._values = {};

    // Create empty object per instance for storing object's modified values.
    this._modified = {};

    // By default constructor is taking first argument which should be an object
    // and applies it to the "_value".
    if (_.isObject(attrs)) {
      _.each(attrs, function(value, fieldName) {
        // Find field definition for the "fieldName".
        var fieldDefinition;
        _.find(this.constructor.schemas, function(schema) {
          return fieldDefinition = schema.getField(fieldName);
        });

        // If there is no field definition then we can set field value.
        if (!fieldDefinition) {
          return;
        }

        // The value being set has to be casted on the type defined in the
        // schema.
        value = Utils.cast(fieldDefinition.type, value);

        this._values[fieldName] = value;
      }, this);
    }
  }
});
