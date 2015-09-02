var methods = {};

methods.typeName = function() {
  return 'Astronomy';
};

methods.toJSONValue = function(args) {
  var doc = this;
  var Class = doc.constructor;

  var json = {
    class: Class.getName(),
    original: EJSON.stringify(doc._original),
    values: EJSON.stringify(
      doc._getAll({
        cast: false
      })
    ),
    isNew: doc._isNew
  };

  var event = new Astro.Event('toJSONValue', json);
  event.target = doc;
  Astro.eventManager.emit(event);

  return json;
};

EJSON.addType('Astronomy', function(json) {
  var Class = Astro.classes[json.class];
  var doc = new Class();
  doc._original = EJSON.parse(json.original);
  _.extend(doc, EJSON.parse(json.values));
  doc._isNew = json.isNew;

  var event = new Astro.Event('fromJSONValue', json);
  event.target = doc;
  Astro.eventManager.emit(event);

  return doc;
});

_.extend(Astro.BaseClass.prototype, methods);
