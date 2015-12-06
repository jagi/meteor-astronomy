let methods = Astro.Module.modules.storage.classStaticMethods;

methods.remove = function() {
  let Class = this;
  let Collection = Class.getCollection();

  // Get arguments.
  let selector = arguments[0];
  let userCallback = arguments[1];

  // Throw exception if we are trying to remove more than one document at once.
  Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'remove');

  // Prepare arguments for Meteor method.
  let meteorMethodName =
    '/Astronomy/' + Class.getName() + '/classRemove';
  let meteorMethodOptions = {
    throwStubExceptions: true,
    returnStubValue: true
  };
  let args = [
    Class.getName(),
    selector
  ];

  // Prepare callback function.
  let callback = Astro.utils.storage.generateMeteorMethodCallback(
    meteorMethodName, userCallback
  );

  try {
    // Run Meteor method.
    return Collection._connection.apply(
      meteorMethodName, args, meteorMethodOptions, callback
    );
  }
  catch(error) {
    callback(error);
  }
};