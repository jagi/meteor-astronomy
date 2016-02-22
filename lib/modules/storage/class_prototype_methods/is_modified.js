import utilIsModified from '../utils/is_modified.js';

function isModified(pattern) {
	let doc = this;

	return utilIsModified({
		doc,
		pattern,
		transient: true
	});
};

export default isModified;