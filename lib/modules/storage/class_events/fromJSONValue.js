function fromJSONValue(e) {
  const doc = e.currentTarget;
  doc._isNew = e.json.isNew;
};

export default fromJSONValue;