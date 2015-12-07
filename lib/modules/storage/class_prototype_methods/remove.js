let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.remove = function(callback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Wrap callback function.
  let wrappedCallback = Astro.utils.storage.wrapCallback('remove', callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (Collection._connection && Collection._connection !== Meteor.server) {

    // Prepare arguments for meteor method.
    let meteorMethodName =
      '/Astronomy/' + Class.getName() + '/documentRemove';
    let args = [doc];
    let options = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run meteor method.
      let result = Collection._connection.apply(
        meteorMethodName, args, options, wrappedCallback
      );
      // Change the "_isNew" flag to "true". After removing a document can be
      // saved again as a new one.
      doc._isNew = true;
      // Return result of the meteor method call.
      return result;
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
      let methodName = 'documentRemove';
      return wrappedCallback(undefined, Astro.utils.storage[methodName](doc));
    } catch(error) {
      wrappedCallback(error);
    }

  }
};
