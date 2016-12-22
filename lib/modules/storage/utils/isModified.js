import {
  includes
}
from 'lodash';
import getModified from './getModified';

function isModified(options = {}) {
  let {
    doc,
    pattern,
    transient = false,
    immutable = false
  } = options;

  let modified = getModified({
    doc,
    transient,
    immutable
  });

  if (pattern) {
    return includes(modified, pattern);
  }
  else {
    return modified.length > 0;
  }
};

export default isModified;