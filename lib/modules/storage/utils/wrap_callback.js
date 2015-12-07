Astro.utils.storage.wrapCallback = function(methodName, callback) {
  return function(error, result) {
    if (callback) {
      callback(error, result);
    } else if (error) {
      if (Meteor.isClient && error instanceof Meteor.Error) {
        Meteor._debug(
          'Error invoking the "' + methodName + '" method: ' + error.message
        );
      } else {
        throw error;
      }
    }

    return result;
  };
};