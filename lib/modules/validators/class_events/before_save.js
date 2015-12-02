let events = Astro.Module.modules.validators.classEvents;

events.beforeSave = function validatorsBeforeSave(e) {
  let doc = e.currentTarget;

  if (!doc.validate()) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
};
