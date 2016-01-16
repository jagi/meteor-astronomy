let events = Astro.Module.modules.validators.classEvents;

events.beforeSave = function validatorsBeforeSave(e) {
  let doc = e.currentTarget;
  let Class = doc.constructor;

  if (Class.getCollection()) {
    doc.validate();
  }
};
