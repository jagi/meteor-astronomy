var typeName = function() {
  return 'Astronomy';
};

var toJSONValue = function(args) {
  var json = {
    class: this.constructor.schema.getName(),
    original: this._original,
    values: this._values
  };

  var eventData = new Astro.EventData(json);
  Astro.eventManager.emit('tojsonvalue', eventData, this);

  return json;
};

ejsonOnInitSchema = function(Class, definition) {
  this.addMethod('typeName', typeName);
  this.addMethod('toJSONValue', toJSONValue);
};
