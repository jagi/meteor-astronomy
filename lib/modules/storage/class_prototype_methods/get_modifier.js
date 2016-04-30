import utilGetModifier from '../utils/get_modifier.js';

function getModifier() {
	let doc = this;

	return utilGetModifier({
		doc
	});
};

export default getModifier;