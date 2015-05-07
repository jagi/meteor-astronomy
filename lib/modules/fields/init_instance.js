fieldsInitInstance = function(attrs) {
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
      value = Astro.Utils.cast(fieldDefinition.type, value);

      this._values[fieldName] = value;
    }, this);
  }
};
