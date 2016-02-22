import setMany from '../utils/set_many.js';
import setOne from '../utils/set_one.js';

function set() {
	let doc = this;
	let args = arguments;

	if (args.length === 1 && _.isObject(args[0])) {
		setMany(doc, args[0]);
	}
	else if (args.length === 2 && typeof args[0] === 'string') {
		setOne(doc, args[0], args[1]);
	}
};

export default set;