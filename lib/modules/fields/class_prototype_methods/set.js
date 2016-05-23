import _ from 'lodash';
import setMany from '../utils/set_many.js';
import setOne from '../utils/set_one.js';
import castNested from '../utils/cast_nested.js';

function set() {
	const doc = this;
	const args = arguments;

	if (args.length === 1 && _.isObject(args[0])) {
		setMany(doc, args[0]);
	}
	else if (args.length === 2 && typeof args[0] === 'string') {
		setOne(doc, args[0], args[1]);
	}

  // Cast nested documents.
  castNested({
    doc
  });
};

export default set;