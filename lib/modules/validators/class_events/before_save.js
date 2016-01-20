let events = Astro.Module.modules.validators.classEvents;

events.beforeSave = function validatorsBeforeSave(e) {
  let doc = e.currentTarget;
  let Class = doc.constructor;

  if (Class.getCollection()) {
		Astro.utils.validators.documentValidate(doc);
  }
};
