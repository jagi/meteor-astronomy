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
    if (pattern.includes(".")) {
      const segments = pattern.split(".");
      return segments.some((segment, index) => {
        if (index > 0) {
          const subPattern = segments.slice(0, index).join(".");
          return _includes(modified, subPattern);
        }
      });
    } else {
      return _includes(modified, pattern);
    }
  } else {
    return modified.length > 0;
  }
}

export default isModified;
