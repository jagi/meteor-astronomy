fieldsInitInstance = function(attrs) {
  // Create "_original" per instance for storing object's values but these
  // values have to be copies of "_values" object using "EJSON.clone" method.
  // Thanks to that we will be able to determine modified fields using
  // "EJSON.equals" method.
  this._original = {};

  // Create "_values" per instance for storing object's values.
  this._values = {};

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

      // Store value in the "_values" object.
      this._values[fieldName] = value;

      // Store a copy of the value in the "_original" object.
      this._original[fieldName] = EJSON.clone(value);
    }, this);
  }
};
