let classEvents = Astro.Module.modules.fields.classEvents;

classEvents.fromJSONValue = function fieldsFromJSONValue(e) {
  let doc = e.currentTarget;
  doc._setAll(EJSON.parse(e.json.values));
};
