import rawAll from '../utils/raw_all.js';
import rawMany from '../utils/raw_many.js';
import rawOne from '../utils/raw_one.js';

function raw() {
	let doc = this;
	let args = arguments;

	if (args.length === 0) {
		return rawAll(doc);
	}
	else if (args.length === 1) {
		if (args[0] instanceof Array) {
			return rawMany(doc, args[0]);
		}
		else if (typeof args[0] === 'string') {
			return rawOne(doc, args[0]);
		}
	}
};

export default raw;