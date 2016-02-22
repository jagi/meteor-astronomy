import getAll from '../utils/get_all.js';

function toJSONValue(e) {
	let doc = e.currentTarget;
	e.json.values = EJSON.stringify(getAll(doc));
};

export default toJSONValue;