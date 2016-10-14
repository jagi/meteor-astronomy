import AstroClass from '../../../core/class';

function astronomyExecute(args = {}) {
  const {
    className,
    selector,
    meteorMethodName,
    meteorMethodArgs
  } = args;

  const Class = AstroClass.get(className);
  const doc = Class.findOne(selector);

  // Get a method from the class. In some cases method may not be present,
  // because it might be defined only on the server.
  const meteorMethod = Class.getMeteorMethod(meteorMethodName);
  if (!meteorMethod) {
    return;
  }

  // Pass the method invocation object as the last argument of the method.
  return meteorMethod.apply(doc, [...meteorMethodArgs, this]);
};

export default astronomyExecute;