let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.save = function(callback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Wrap callback function.
  let wrappedCallback = Astro.utils.wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (Collection._connection && Collection._connection !== Meteor.server) {

    // Prepare arguments for meteor method.
    let methodName =
      '/Astronomy/document' + (doc._isNew ? 'Insert' : 'Update');
    let args = [doc];
    let options = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run Meteor method.
      let result = Collection._connection.apply(
        methodName, args, options, wrappedCallback
      );
      // Depending on if we are inserting or updating, do something with the
      // result of the meteor method call.
      if (doc._isNew) {
        doc._id = result;
        doc._isNew = false;
      }
      // Return result of the meteor method call.
      return result;
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
      // Insert or update a document.
      let methodName = 'document' + (doc._isNew ? 'Insert' : 'Update');
      return wrappedCallback(undefined, Astro.utils.storage[methodName](doc));
    } catch(error) {
      wrappedCallback(error);
    }

  }
};
