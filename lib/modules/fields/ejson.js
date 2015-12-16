var events = {};

events.toJSONValue = function(e) {
  var doc = this;
  var Class = doc.constructor;

  var values = {};
  _.each(Class.getFieldsNames(), function(fieldName) {
    values[fieldName] = doc[fieldName];
  });

  var json = {
    modifiers: EJSON.stringify(doc._modifiers),
    values: EJSON.stringify(values)
  };

  _.extend(e.data, json);
};

events.fromJSONValue = function(e) {
  var doc = this;
  var json = e.data;

  doc._modifiers = EJSON.parse(json.modifiers);
  _.extend(doc, EJSON.parse(json.values));
};

Astro.eventManager.on('toJSONValue', events.toJSONValue);
Astro.eventManager.on('fromJSONValue', events.fromJSONValue);
