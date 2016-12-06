function toJSONValue(e) {
  const doc = e.currentTarget;
  e.json.isNew = doc._isNew;
};

export default toJSONValue;