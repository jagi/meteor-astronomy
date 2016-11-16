import {
  isFunction,
  last
}
from 'lodash';
import callMeteorMethodUtil from '../../storage/utils/call_meteor_method';
import rawAll from '../../fields/utils/raw_all';

function applyMethod(methodName, methodArgs, callback) {
  const doc = this;
  const Class = doc.constructor;

  // Prepare arguments to be sent to the "/Astronomy/execute" method.
  const meteorMethodArgs = {
    className: Class.getName(),
    methodName,
    methodArgs
  };
  if (Class.isNew(doc)) {
    meteorMethodArgs.rawDoc = rawAll(doc, {
      transient: false
    });
  }
  else {
    meteorMethodArgs.id = doc._id;
  }
  return callMeteorMethodUtil(
    Class, '/Astronomy/execute', [meteorMethodArgs], callback
  );
};

export default applyMethod;