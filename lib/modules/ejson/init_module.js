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

  var event = new Astro.Event('tojsonvalue', json);
  event.target = this;
  Astro.emit(event);

  return json;
};

ejsonOnInitModule = function() {
  EJSON.addType('Astronomy', function(json) {
    var Class = Astro.classes[json.class];
    var doc = new Class();
    doc._original = json.original;
    doc._values = json.values;

    var event = new Astro.Event('fromjsonvalue', json);
    event.target = doc;
    Astro.emit(event);

    return doc;
  });

  _.extend(Astro.BaseClass.prototype, methods);
};
