let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.save = function(userCallback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Prepare arguments for Meteor method.
  let meteorMethodName =
    '/Astronomy/' + Class.getName() + '/document' +
    (doc._isNew ? 'Insert' : 'Update');
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
    let result;
    if (Collection._connection) {
      result = Collection._connection.apply(
        meteorMethodName, args, options, callback
      );
    } else {
      result = Meteor.apply(
        meteorMethodName, args, options, callback
      );
    }
    // If it's a new document then we are inserting and the returned value
    // should be a document id.
    if (doc._isNew) {
      doc._id = result;
      // Change the "_isNew" flag to "false". Now a document is not new.
      doc._isNew = false;
    }
    // Return value from the method execution.
    return result;
  }
  // Meteor method can throw an error (options argument) and we have to decide
  // what to do with it. If there is a callback function we will call it with
  // the error. If there is no callback function then we will just log
  // information about the error.
  catch(error) {
    callback(error);
  }
};
