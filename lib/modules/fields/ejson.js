var events = {};

events.toJSONValue = function(e) {
  var doc = this;

  var json = {
    original: EJSON.stringify(doc._original),
    modifier: EJSON.stringify(doc._modifier),
    values: EJSON.stringify(doc._getAll())
  };

  _.extend(e.data, json);
};

events.fromJSONValue = function(e) {
  var doc = this;
  var json = e.data;

  doc._original = EJSON.parse(json.original);
  doc._modifier = EJSON.parse(json.modifier);
  _.extend(doc, EJSON.parse(json.values));
};

Astro.eventManager.on('toJSONValue', events.toJSONValue);
Astro.eventManager.on('fromJSONValue', events.fromJSONValue);
