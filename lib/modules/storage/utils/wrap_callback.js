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

Astro.utils.storage.wrapCallback = function(methodName, callback) {
  return function(error, result) {
    if (callback) {
      callback(error, result);
    } else if (error) {
      if (Meteor.isClient) {
        Meteor._debug(
          'Error on invoking "' + methodName + '" method: ' + error.message
        );
      } else {
        throw error;
      }
    }

    return result;
  };
};