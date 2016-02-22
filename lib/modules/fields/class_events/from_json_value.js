import setAll from '../utils/set_all.js';

function fromJSONValue(e) {
	let doc = e.currentTarget;
	setAll(doc, EJSON.parse(e.json.values));
};

export default fromJSONValue;