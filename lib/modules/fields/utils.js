Astro.Utils.cast = function(type, value) {
  // We only cast value if it's not null or undefined and the type is defined.
  if (type && !_.isUndefined(value) && !_.isNull(value)) {
    value = Types[type](value);
  }

  return value;
};

Astro.Utils.getAllFieldsNames = function() {
  // Get list of all fields defined in this and parent schemas.
  var fieldsNames = [];

  _.each(this.constructor.schemas, function(schema) {
    fieldsNames = fieldsNames.concat(_.keys(schema.getFields()));
  });

  return _.uniq(fieldsNames);
};

Astro.Utils.getFieldValue = function(fieldName) {
  var value;

  // Look for a field's definition.
  var fieldDefinition = Astro.Utils.getFieldDefinition.call(this, fieldName);

  // If the field's definition is not present then we just return "undefined".
  if (!fieldDefinition) {
    return;
  }

  // Look for value in the "_values" object.
  if (_.has(this._values, fieldName)) {

    value = this._values[fieldName];

  } else {

    // If value is not present in the "_values" objects then we have to look for
    // default value in the field's definition. We have to use the "EJSON.clone"
    // method to make sure that the value being set is a copy of default value
    // and not a reference.
    value = EJSON.clone(fieldDefinition.default);

    // At the same time, we can set value for that field in the "_values" object
    // so that getting this value in the future won't required checking its
    // default value.
    this._values[fieldName] = value;
  }

  return value;
};

Astro.Utils.getAllFieldsValues = function() {
  var values = {};
  var fieldsNames = Astro.Utils.getAllFieldsNames.call(this);

  _.each(fieldsNames, function(fieldName) {
    var value = Astro.Utils.getFieldValue.call(this, fieldName);
    if (!_.isUndefined(value)) {
      values[fieldName] = value;
    }
  }, this);

  return values;
};

Astro.Utils.setFieldValue = function(fieldName, fieldValue) {
  // Look for a field's definition.
  var fieldDefinition = Astro.Utils.getFieldDefinition.call(this, fieldName);

  // If the field's definition is not present then we just return "undefined".
  if (!fieldDefinition) {
    return false;
  }

  // The value being set has to be casted on the type defined in the schema.
  fieldValue = Astro.Utils.cast(fieldDefinition.type, fieldValue);

  // Then we just set a new value.
  this._values[fieldName] = fieldValue;

  return true;
};

Astro.Utils.getFieldDefinition = function(fieldName) {
  // Find field definition for the "fieldName" in this and parent schemas.
  var fieldDefinition;
  _.find(this.constructor.schemas, function(schema) {
    return fieldDefinition = schema.getField(fieldName);
  });

  return fieldDefinition;
};
