import {
  isFunction,
  last
}
from 'lodash';
import callMeteorMethodUtil from '../../storage/utils/call_meteor_method';

function applyMethod(meteorMethodName, meteorMethodArgs, callback) {
  const doc = this;
  const Class = doc.constructor;

  // Prepare arguments to be sent to the "/Astronomy/execute" method.
  const methodArgs = {
    className: Class.getName(),
    selector: {
      _id: doc._id
    },
    meteorMethodName,
    meteorMethodArgs
  };
  return callMeteorMethodUtil(
    Class, '/Astronomy/execute', [methodArgs], callback
  );
};

export default applyMethod;