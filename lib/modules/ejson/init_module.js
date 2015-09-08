var methods = {};

methods.typeName = function() {
  return 'Astronomy';
};

methods.toJSONValue = function(args) {
  var doc = this;
  var Class = doc.constructor;

  var json = {
    class: Class.getName(),
    isNew: doc._isNew
  };

  var event = new Astro.Event('toJSONValue', json);
  event.target = doc;
  Astro.eventManager.emit(event);

  return json;
};

EJSON.addType('Astronomy', function(json) {
  var Class = Astro.getClass(json.class);
  var doc = new Class();
  doc._isNew = json.isNew;

  var event = new Astro.Event('fromJSONValue', json);
  event.target = doc;
  Astro.eventManager.emit(event);

  return doc;
});

_.extend(Astro.BaseClass.prototype, methods);
