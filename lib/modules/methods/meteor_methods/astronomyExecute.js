import AstroClass from '../../../core/class';

function astronomyExecute(args = {}) {
  const {
    className,
    selector,
    methodName,
    methodArgs
  } = args;

  const Class = AstroClass.get(className);
  const doc = Class.findOne(selector);

  // Get a method from the class. In some cases method may not be present,
  // because it might be defined only on the server.
  const method = Class.getMeteorMethod(methodName);
  if (!method) {
    return;
  }

  return method.apply(doc, methodArgs);
};

export default astronomyExecute;