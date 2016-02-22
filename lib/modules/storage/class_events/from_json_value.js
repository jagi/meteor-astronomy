function fromJSONValue(e) {
	let doc = e.currentTarget;
	doc._isNew = e.json.isNew;
};

export default fromJSONValue;