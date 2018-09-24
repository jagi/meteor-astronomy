import _last from 'lodash/last';
import applyMethod from './applyMethod';

function callMethod(methodName, ...methodArgs) {
  // Get the last argument.
  let callback = _last(methodArgs);
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
  return applyMethod.call(this, methodName, methodArgs, callback);
};

export default callMethod;