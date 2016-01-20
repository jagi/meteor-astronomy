let methods = Astro.Module.modules.storage.classStaticMethods;

methods.update = function() {
  let Class = this;
  let Collection = Class.getCollection();

  // Get arguments.
  let className = Class.getName();
  let selector = arguments[0];
  let modifier = arguments[1];
  // Cloning the third argument prevents from setting a callback function to the
  // "options" variable.
  let options = _.clone(arguments[2]) || {};
  let callback;
  let lastArg = arguments[arguments.length - 1];
  if (lastArg instanceof Function) {
    callback = lastArg;
  }

  // Throw exception if we are trying to update more than one document at once.
  Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'update');

  // Prepare arguments.
  let args = [className, selector, modifier, options];

  // Wrap callback function.
  let wrappedCallback = Astro.utils.wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (Collection._connection && Collection._connection !== Meteor.server) {

    // Prepare arguments for meteor method.
    let methodName = '/Astronomy/classUpdate';
    let options = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run Meteor method.
      return Collection._connection.apply(
        methodName, args, options, wrappedCallback
      );
    }
    // Catch stub exceptions.
    catch(error) {
      wrappedCallback(error);
    }

  }
  // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  else {

    try {
      // Remove a document.
      return wrappedCallback(
        undefined, Astro.utils.storage.classUpdate.apply(null, args)
      );
    } catch(error) {
      wrappedCallback(error);
    }

  }
};