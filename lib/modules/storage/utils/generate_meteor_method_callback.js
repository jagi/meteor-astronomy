Astro.utils.storage.generateMeteorMethodCallback = function(
  meteorMethodName, callback
) {
  return function(error, result) {
    if (callback instanceof Function) {
      callback.call(callback, error, result);
    } else if (error) {
      if (Meteor.isClient) {
        Meteor._debug(
          'Error invoking Method \'' + meteorMethodName + '\': ' + error.message
        );
      } else {
        throw error;
      }
    }
  };
};