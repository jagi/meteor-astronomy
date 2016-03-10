import utilGetModified from '../utils/get_modified.js';
import rawOne from '../../fields/utils/raw_one.js';

function getModifiedValues(options = {}) {
  let {
    old = false,
    raw = false
  } = options;

  let doc = this;
  const Class = doc.constructor;

  // Get list of modified fields.
  const modified = utilGetModified({
    doc,
    transient: true
  });

  // Get old or new values of a document.
  if (old) {
    doc = doc._isNew ? new Class() : Class.findOne(doc._id);
  }

  // Collect values for each field.
  const values = {};
  _.each(modified, (name) => {
    if (raw) {
      values[name] = rawOne(doc, name);
    }
    else {
      values[name] = doc.get(name);
    }
  });

  return values;
};

export default getModifiedValues;