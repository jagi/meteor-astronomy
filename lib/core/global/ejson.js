EJSON.addType('Astronomy', function(json) {
  let Class = Astro.Class.get(json.class);
  let doc = new Class();

  // Trigger the "fromJSONValue" event handlers.
  doc.dispatchEvent(new Astro.Event('fromJSONValue', {
    json: json
  }));

  return doc;
});
