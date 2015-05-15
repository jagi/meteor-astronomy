ejsonOnInitModule = function() {
  EJSON.addType('Astronomy', function(json) {
    var Class = Classes[json.class];
    var doc = new Class();
    doc._original = json.original;
    doc._values = json.values;

    var eventData = new Astro.EventData(json);
    Astro.eventManager.emit('fromjsonvalue', eventData, doc);

    return doc;
  });

  var baseClassProto = Astro.BaseClass.prototype;

  baseClassProto.typeName = function() {
    return 'Astronomy';
  };

  baseClassProto.toJSONValue = function(args) {
    var json = {
      class: this.constructor.schema.getName(),
      original: this._original,
      values: this._values
    };

    var eventData = new Astro.EventData(json);
    Astro.eventManager.emit('tojsonvalue', eventData, this);

    return json;
  };
};
