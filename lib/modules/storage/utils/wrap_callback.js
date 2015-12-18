Astro.utils.storage.wrapCallback = function(methodName, callback) {
  return function(error, result) {
    if (callback) {
      callback(error, result);
    } else if (error) {
      throw error;

      // TODO: Decide if we should throw an exception on the client when no
      // callback is provided.
      // if (Meteor.isClient && error instanceof Meteor.Error) {
      //   Meteor._debug(
      //     'Error invoking the "' + methodName + '" method: ' + error.message
      //   );
      // } else {
      //   throw error;
      // }
    }

    return result;
  };
};