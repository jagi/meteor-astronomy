import getAll from '../utils/get_all.js';
import getMany from '../utils/get_many.js';
import getOne from '../utils/get_one.js';

function get() {
	let doc = this;
	let args = arguments;

	if (args.length === 0) {
		return getAll(doc);
	}
	else if (args.length === 1) {
		if (args[0] instanceof Array) {
			return getMany(doc, args[0]);
		}
		else if (typeof args[0] === 'string') {
			return getOne(doc, args[0]);
		}
	}
};

export default get;