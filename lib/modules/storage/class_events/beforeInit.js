import {
  has
}
from 'lodash';
import deprecated from '../../core/utils/deprecated';

function beforeInit(e) {
  const doc = e.currentTarget;
  const Class = doc.constructor;
  // Create the "_isNew" property to indicate if a document had been stored in
  // a database.
  if (Object.defineProperty && !has(doc, '_isNew')) {
    Object.defineProperty(doc, '_isNew', {
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
};

export default beforeInit;