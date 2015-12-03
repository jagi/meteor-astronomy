let classEvents = Astro.Module.modules.fields.classEvents;

classEvents.toJSONValue = function fieldsToJSONValue(e) {
  let doc = e.currentTarget;
  e.json.values = EJSON.stringify(doc._getAll());
};
