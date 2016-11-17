import utilIsModified from '../utils/isModified';

function isModified(pattern) {
	let doc = this;

	return utilIsModified({
		doc,
		pattern,
		transient: true
	});
};

export default isModified;