let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.save = function(userCallback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Prepare result from the "save" method.
  let result = true;
  // Prepare arguments for Meteor method.
  let methodName = '/' + Class.getName() + '/save';
  let args = [doc];
  let options = {
    throwStubExceptions: true
  };
  // Prepare callback function.
  let callback = function(error, result) {
    if (error) {
      result = false;
    }

    if (userCallback instanceof Function) {
      userCallback(error, result);
    } else if (error) {
      if (Meteor.isClient) {
        Meteor._debug(
          'Error invoking Method \'' + methodName + '\': ' + error.message
        );
      } else {
        throw error;
      }
    }
  };

  // Run Meteor method.
  try {
    Collection._connection.apply(methodName, args, options, callback);
  }
  // Meteor method can throw an error (options argument) and we have to decide
  // what to do with it. If there is a callback function we will call it with
  // the error. If there is no callback function then we will just log
  // information about the error.
  catch(error) {
    callback(error);
  }

  return result;
};
