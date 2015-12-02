let classEvents = Astro.Module.modules.storage.classEvents;

classEvents.fromJSONValue = function storageFromJSONValue(e) {
  let doc = e.currentTarget;
  doc._isNew = e.json.isNew;
};
