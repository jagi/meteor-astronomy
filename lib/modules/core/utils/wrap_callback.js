function wrapCallback(callback) {
  return function(err, result) {
		if (err && !(err instanceof Meteor.Error)) {
			throw err;
		}
		if (callback) {
      callback(err, result);
    } else if (err) {
      throw err;
    }
    return result;
  };
};

export default wrapCallback;