import {
  isFunction,
  last
}
from 'lodash';
import callMeteorMethod from '../../storage/utils/call_meteor_method';

function wrapMethod(meteorMethodName) {
  return function(...meteorMethodArgs) {
    const doc = this;
    const Class = doc.constructor;

    // Get the last argument.
    let callback = last(meteorMethodArgs);
    // If the last argument is a callback function, then remove the last
    // argument.
    if (isFunction(callback)) {
      meteorMethodArgs.pop();
    }
    // If the last argument is not a callback function, then clear the
    // "callback" variable.
    else {
      callback = undefined;
    }
    // Prepare arguments to be sent to the "/Astronomy/execute" method.
    const methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      meteorMethodName,
      meteorMethodArgs
    };
    return callMeteorMethod(
      Class, '/Astronomy/execute', [methodArgs], callback
    );
  };
}

export default wrapMethod;