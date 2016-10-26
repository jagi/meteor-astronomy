import {
  isFunction,
  last
}
from 'lodash';
import applyMethod from './applyMethod';

function callMethod(methodName, ...methodArgs) {
  // Get the last argument.
  let callback = last(methodArgs);
  // If the last argument is a callback function, then remove the last
  // argument.
  if (isFunction(callback)) {
    methodArgs.pop();
  }
  // If the last argument is not a callback function, then clear the
  // "callback" variable.
  else {
    callback = undefined;
  }
  applyMethod.call(this, methodName, methodArgs, callback);
};

export default callMethod;