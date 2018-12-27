import _each from "lodash/each";
import utilGetModified from "../utils/getModified";
import rawOne from "../../fields/utils/rawOne";

function getModifiedValues(options = {}) {
  let { old = false, raw = false, fields } = options;

  let doc = this;
  const Class = doc.constructor;

  // Get list of modified fields.
  const modified = utilGetModified({
    doc,
    transient: true,
    fields
  });

  // Get old or new values of a document.
  if (old) {
    doc = Class.findOne(doc._id);
    if (!doc) {
      doc = new Class();
    }
  }

  // Collect values for each field.
  const values = {};
  _each(modified, name => {
    if (raw) {
      values[name] = rawOne(doc, name);
    } else {
      values[name] = doc.get(name);
    }
  });

  return values;
}

export default getModifiedValues;
