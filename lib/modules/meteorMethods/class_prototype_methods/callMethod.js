import {
  isFunction,
  last
}
from 'lodash';
import applyMethod from './applyMethod';

function callMeteorMethod(meteorMethodName, ...meteorMethodArgs) {
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
  applyMethod.call(this, meteorMethodName, meteorMethodArgs, callback);
};

export default callMeteorMethod;