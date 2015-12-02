let classEvents = Astro.Module.modules.storage.classEvents;

classEvents.toJSONValue = function storageToJSONValue(e) {
  let doc = e.currentTarget;
  e.json.isNew = doc._isNew;
};
