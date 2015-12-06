let methods = Astro.Module.modules.storage.classStaticMethods;

methods.update = function() {
  let Class = this;
  let Collection = Class.getCollection();

  // Get arguments.
  let selector = arguments[0];
  let modifier = arguments[1];
  // Cloning the third argument prevents from setting a callback function to the
  // "options" variable.
  let options = _.clone(arguments[2]) || {};
  let userCallback;
  let lastArg = arguments[arguments.length - 1];
  if (lastArg instanceof Function) {
    userCallback = lastArg;
  }

  // Throw exception if we are trying to update more than one document at once.
  Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'update');

  // Prepare arguments for Meteor method.
  let meteorMethodName =
    '/Astronomy/' + Class.getName() + '/classUpdate';
  let meteorMethodOptions = {
    throwStubExceptions: true,
    returnStubValue: true
  };
  let args = [
    Class.getName(),
    selector,
    modifier,
    options
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