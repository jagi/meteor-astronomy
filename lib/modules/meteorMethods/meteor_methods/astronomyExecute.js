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
  const meteorMethod = Class.getMeteorMethod(meteorMethodName);

  return meteorMethod.apply(this, [doc, ...meteorMethodArgs]);
};

export default astronomyExecute;