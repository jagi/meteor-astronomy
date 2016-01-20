Astro.utils.wrapCallback = function(callback) {
  return function(err, result) {
		if (callback) {
      callback(err, result);
    } else if (err) {
      throw err;
    }
    return result;
  };
};