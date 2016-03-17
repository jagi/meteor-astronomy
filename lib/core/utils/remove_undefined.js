function removeUndefined(obj) {
  return _.transform(obj, function (o, v, k) {
    if (_.isPlainObject(v)) {
      o[k] = removeUndefined(v);
    } else if (!_.isUndefined(v)) {
      o[k] = v;
    }
  });
};

export default removeUndefined;
