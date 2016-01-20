let events = Astro.Module.modules.validators.classEvents;

events.beforeSave = function validatorsBeforeSave(e) {
  let doc = e.currentTarget;
  let Class = doc.constructor;

  if (Class.getCollection()) {
		let fieldsNames = Class.getValidationOrder();
		Astro.utils.storage.documentValidate(doc, fieldsNames, true);
  }
};
