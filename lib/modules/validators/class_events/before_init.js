let events = Astro.Module.modules.validators.classEvents;

events.beforeInit = function validatorsBeforeInit(e) {
  let doc = e.currentTarget;

  doc._errors = new ReactiveMap();
};
