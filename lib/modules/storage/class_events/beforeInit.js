import deprecated from '../../core/utils/deprecated';

function beforeInit(e) {
  const doc = e.currentTarget;
  const Class = doc.constructor;

  if (Object.defineProperty && !Class.prototype.hasOwnProperty('_isNew')) {
    Object.defineProperty(Class.prototype, '_isNew', {
      enumerable: false,
      get() {
        deprecated(
          `Usage of the "_isNew" property have been deprecated. Please use ` +
          `the "${Class.getName()}.isNew(doc)" function.`
        )
        return Class.isNew(this);
      }
    });
  }
}

export default beforeInit;