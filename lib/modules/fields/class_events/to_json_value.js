import getAll from '../utils/getAll';

function toJSONValue(e) {
	let doc = e.currentTarget;
	e.json.values = EJSON.stringify(getAll(doc));
};

export default toJSONValue;