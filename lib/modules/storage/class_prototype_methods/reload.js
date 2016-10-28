import {
  each
}
from 'lodash';
import castNested from '../../fields/utils/castNested';
import resolveValues from '../../fields/utils/resolve_values';
import Event from '../../events/event';

function reload() {
  const doc = this;
  const Class = doc.constructor;

  // The document has to be already saved in the collection.
  if (!doc._isNew) {
    // Get a document from the collection without transformation.
    const rawDoc = Class.findOne(doc._id, {
      transform: null
    });

    // Trigger the "beforeInit" event handlers.
    doc.dispatchEvent(new Event('beforeInit'));

    // Set all fields.
    doc.set(resolveValues({
      Class,
      values: rawDoc
    }));

    // Trigger the "afterInit" event handlers.
    doc.dispatchEvent(new Event('afterInit'));

    // Mark the document as not new.
    doc._isNew = false;
  }
};

export default reload;