Astro.utils.storage.throwIfSelectorIsNotId = function(
  Collection, selector, methodName
) {
  if (Collection._connection && Collection._connection !== Meteor.server) {
    let enclosing = DDP._CurrentInvocation.get();
    let alreadyInSimulation = enclosing && enclosing.isSimulation;
    if (!alreadyInSimulation && methodName !== 'insert') {
      if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {
        throw new Meteor.Error(
          403, 'Not permitted. Untrusted code may only ' + methodName +
          ' documents by ID.'
        );
      }
    }
  }
};