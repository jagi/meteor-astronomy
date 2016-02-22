function toJSONValue(e) {
	let doc = e.currentTarget;
	e.json.isNew = doc._isNew;
};

export default toJSONValue;