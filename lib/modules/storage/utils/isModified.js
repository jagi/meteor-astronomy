import _includes from "lodash/includes";

import getModified from "./getModified";

function isModified(options = {}) {
  let { doc, pattern, transient = false, immutable = false } = options;

  const modified = getModified({
    doc,
    transient,
    immutable
  });

  if (pattern) {
    return _includes(modified, pattern);
  } else {
    return modified.length > 0;
  }
}

export default isModified;
