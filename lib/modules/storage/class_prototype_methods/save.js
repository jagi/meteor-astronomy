let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.save = function(userCallback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Prepare arguments for Meteor method.
  let methodName = '/' + Class.getName() + '/save';
  let args = [doc];
  let options = {
    throwStubExceptions: true
  };

  // Prepare callback function.
  let callback = function(error) {
    if (userCallback instanceof Function) {
      userCallback.apply(userCallback, arguments);
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
    return Collection._connection.apply(methodName, args, options, callback);
  }
  // Meteor method can throw an error (options argument) and we have to decide
  // what to do with it. If there is a callback function we will call it with
  // the error. If there is no callback function then we will just log
  // information about the error.
  catch(error) {
    callback(error);
  }
};
