var typeName = function() {
  return 'Astronomy';
};

var toJSONValue = function() {
  return {
    class: this.constructor.schema.getName(),
    original: this._original,
    values: this._values
  };
};

ejsonOnInitSchema = function(Class, definition) {
  this.addMethod('typeName', typeName);
  this.addMethod('toJSONValue', toJSONValue);
};
