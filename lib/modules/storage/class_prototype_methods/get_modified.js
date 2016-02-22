import utilGetModified from '../utils/get_modified.js';

function getModified(old) {
	let doc = this;

	return utilGetModified({
		doc,
		transient: true
	});
};

export default getModified;