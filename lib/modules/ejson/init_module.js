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
};
