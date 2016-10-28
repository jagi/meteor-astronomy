function fromJSONValue(e) {
  let doc = e.currentTarget;
  doc.set(EJSON.parse(e.json.values), {
    defaults: false,
    clone: false,
    cast: true
  });
}

export default fromJSONValue;