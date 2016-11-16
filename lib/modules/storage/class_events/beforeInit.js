import {
  has
}
from 'lodash';

function beforeInit(e) {
  const doc = e.currentTarget;
  const Class = doc.constructor;
  // Create the "_isNew" property to indicate if a document had been stored in
  // a database.
  if (Object.defineProperty && !has(doc, '_isNew')) {
    Object.defineProperty(doc, '_isNew', {
      enumerable: false,
      get() {
        return Class.isNew(this);
      }
    });
  }
};

export default beforeInit;