fieldsOnInitInstance = function(attrs) {
  // Create "_original" per instance for storing object's values but these
  // values have to be copies of "_values" object using "EJSON.clone" method.
  // Thanks to that we will be able to determine modified fields using
  // "EJSON.equals" method.
  this._original = {};

  // Create "_values" per instance for storing object's values.
  this._values = {};

  if (_.isObject(attrs)) {
    // By default constructor is taking the first argument which should be an
    // object and applies all its value to the "_values" object.
    _.each(attrs, function(fieldValue, fieldName) {
      Astro.Utils.setFieldValue(this, fieldName, fieldValue);
    }, this);

    // Copy values from the "_values" object to "_original" so that we are
    // starting with the clean object without modifications (there is no diff
    // between "_values" and "_original").
    this._original = EJSON.clone(this._values);
  }
};
