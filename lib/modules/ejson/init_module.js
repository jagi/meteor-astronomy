var methods = {
  typeName: function() {
    return 'Astronomy';
  },

  toJSONValue: function(args) {
    var doc = this;
    var Class = doc.constructor;

    var json = {
      class: Class.getName(),
      original: EJSON.stringify(doc._original),
      values: EJSON.stringify(
        Astro.utils.fields.getAllValues(doc, {
          cast: false,
          default: false
        })
      ),
      isNew: doc._isNew
    };

    var event = new Astro.Event('tojsonvalue', json);
    event.target = doc;
    Astro.eventManager.emit(event);

    return json;
  }
};

EJSON.addType('Astronomy', function(json) {
  var Class = Astro.classes[json.class];
  var doc = new Class();
  doc._original = EJSON.parse(json.original);
  _.extend(doc, EJSON.parse(json.values));
  doc._isNew = json.isNew;

  var event = new Astro.Event('fromjsonvalue', json);
  event.target = doc;
  Astro.eventManager.emit(event);

  return doc;
});

_.extend(Astro.BaseClass.prototype, methods);
