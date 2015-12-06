let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.remove = function(userCallback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Prepare arguments for Meteor method.
  let meteorMethodName =
    '/Astronomy/' + Class.getName() + '/documentRemove';
  let args = [doc];
  let options = {
    throwStubExceptions: true,
    returnStubValue: true
  };

  // Prepare callback function.
  let callback = Astro.utils.storage.generateMeteorMethodCallback(
    meteorMethodName, userCallback
  );

  try {
    // Run Meteor method.
    return Collection._connection.apply(
      meteorMethodName, args, options, callback
    );
    // Change the "_isNew" flag to "true". Now a document is new and we can save
    // it again.
    doc._isNew = true;
  }
  // Meteor method can throw an error (options argument) and we have to decide
  // what to do with it. If there is a callback function we will call it with
  // the error. If there is no callback function then we will just log
  // information about the error.
  catch(error) {
    callback(error);
  }
};
