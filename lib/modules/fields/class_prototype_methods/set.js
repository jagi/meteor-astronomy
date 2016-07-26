import _ from 'lodash';
import setMany from '../utils/set_many.js';
import setOne from '../utils/set_one.js';
import castNested from '../utils/cast_nested.js';

function set() {
  const doc = this;
  const args = arguments;
  let options = {
    clone: true
  };

  // Setting single field.
  if (_.isString(args[0]) && args.length >= 2) {
    // The last argument is an options object.
    if (_.isObject(args[2])) {
      _.extend(options, args[2]);
    }
    setOne(doc, args[0], args[1], options);
  }
  else if (_.isObject(args[0]) && args.length >= 1) {
    // The last argument is an options object.
    if (_.isObject(args[1])) {
      _.extend(options, args[1]);
    }
    setMany(doc, args[0], options);
  }

  // Cast nested documents.
  castNested({
    doc,
    options: {
      clone: options.clone
    }
  });
};

export default set;