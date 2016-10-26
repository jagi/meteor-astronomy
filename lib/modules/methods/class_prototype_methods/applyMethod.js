import {
  isFunction,
  last
}
from 'lodash';
import callMeteorMethodUtil from '../../storage/utils/call_meteor_method';

function applyMethod(methodName, methodArgs, callback) {
  const doc = this;
  const Class = doc.constructor;

  // Prepare arguments to be sent to the "/Astronomy/execute" method.
  const meteorMethodArgs = {
    className: Class.getName(),
    selector: {
      _id: doc._id
    },
    methodName,
    methodArgs
  };
  return callMeteorMethodUtil(
    Class, '/Astronomy/execute', [meteorMethodArgs], callback
  );
};

export default applyMethod;