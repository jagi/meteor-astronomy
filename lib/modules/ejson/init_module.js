var methods = {};

methods.typeName = function() {
  return 'Astronomy';
};

methods.toJSONValue = function(args) {
  var json = {
    class: this.constructor.getName(),
    original: this._original,
    values: this._values
  };

  var eventData = new Astro.EventData(json);
  Astro.eventManager.emit('tojsonvalue', eventData, this);

  return json;
};

ejsonOnInitModule = function() {
  EJSON.addType('Astronomy', function(json) {
    var Class = Astro.classes[json.class];
    var doc = new Class();
    doc._original = json.original;
    doc._values = json.values;

    var eventData = new Astro.EventData(json);
    Astro.eventManager.emit('fromjsonvalue', eventData, doc);

    return doc;
  });

  _.extend(Astro.BaseClass.prototype, methods);
};
