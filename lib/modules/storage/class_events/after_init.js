let classEvents = Astro.Module.modules.storage.classEvents;

classEvents.afterInit = function storageAfterInit(e) {
  let doc = e.currentTarget;
  let Class = doc.constructor;

  doc[Class.getTypeField()] = Class.getName();
};
