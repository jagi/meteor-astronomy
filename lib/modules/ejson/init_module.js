var methods = {
  typeName: function() {
    return 'Astronomy';
  },

  toJSONValue: function(args) {
    var Class = this.constructor;

    var json = {
      class: Class.getName(),
      original: this._original,
      values: Astro.utils.fields.getValuesOfAllFields(this, false)
    };

    var event = new Astro.Event('tojsonvalue', json);
    event.target = this;
    Astro.eventManager.emit(event);

    return json;
  }
};

ejsonOnInitModule = function() {
  EJSON.addType('Astronomy', function(json) {
    var Class = Astro.classes[json.class];
    var doc = new Class();
    doc._original = json.original;
    _.extend(doc, json.values);

    var event = new Astro.Event('fromjsonvalue', json);
    event.target = doc;
    Astro.eventManager.emit(event);

    return doc;
  });

  _.extend(Astro.BaseClass.prototype, methods);
};
