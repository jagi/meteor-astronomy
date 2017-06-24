import last from 'lodash/last';
import callMeteorMethod from '../../storage/utils/call_meteor_method';
import rawAll from '../../fields/utils/rawAll';

function wrapMethod(methodName) {
  return function(...methodArgs) {
    const doc = this;
    const Class = doc.constructor;

    // Get the last argument.
    let callback = last(methodArgs);
    // If the last argument is a callback function, then remove the last
    // argument.
    if (typeof callback === 'function') {
      methodArgs.pop();
    }
    // If the last argument is not a callback function, then clear the
    // "callback" variable.
    else {
      callback = undefined;
    }
    // Prepare arguments to be sent to the "/Astronomy/execute" method.
    const meteorMethodArgs = {
      className: Class.getName(),
      methodName,
      methodArgs
    };
    if (doc._isNew) {
      meteorMethodArgs.rawDoc = rawAll(doc, {
        transient: false
      });
    }
    else {
      meteorMethodArgs.id = doc._id;
    }

    try {
      // Run Meteor method.
      return callMeteorMethod(
        Class, '/Astronomy/execute', [meteorMethodArgs], callback
      );
    }
    // Catch stub exceptions.
    catch (err) {
      if (callback) {
        callback(err);
        return null;
      }
      throw err;
    }
  };
}

export default wrapMethod;