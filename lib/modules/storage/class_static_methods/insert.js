let methods = Astro.Module.modules.storage.classStaticMethods;

methods.insert = function() {
  let Class = this;
  let Collection = Class.getCollection();

  // Get arguments.
  let className = Class.getName();
  let values = arguments[0];
  let callback = arguments[1];

  // Prepare arguments.
  let args = [className, values];

  // Wrap callback function.
  let wrappedCallback = Astro.utils.wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (Collection._connection && Collection._connection !== Meteor.server) {

    // Prepare arguments for meteor method.
    let methodName = '/Astronomy/classInsert';
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
  // If we can just insert a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  else {

    try {
      // Insert a document.
      return wrappedCallback(
        undefined, Astro.utils.storage.classInsert.apply(null, args)
      );
    } catch(error) {
      wrappedCallback(error);
    }

  }
};