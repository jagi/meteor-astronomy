Astro.errors = {
  _errors: {}
};

var replaceParams = function(error, params) {
  return error.replace(/\{(\d+)\}/g, function(match) {
    return params[parseInt(match[1], 10)];
  });
};

Astro.errors.throw = function(name) {
  var params = Array.prototype.slice.call(arguments, 1);
  var error = this._errors[name];

  if (error) {
    throw new Error(replaceParams(error, params));
  } else {
    throw new Error('There is no "' + name + '" error');
  }
};

Astro.errors.log = function(name) {
  var params = Array.prototype.slice.call(arguments, 1);
  var error = this._errors[name];

  if (error) {
    if (console) {
      console.log(replaceParams(error, params));
    }
  } else {
    throw new Error('There is no "' + name + '" error');
  }
};

Astro.errors.warn = function(name) {
  var params = Array.prototype.slice.call(arguments, 1);
  var error = this._errors[name];

  if (error) {
    if (console) {
      console.warn(replaceParams(error, params));
    }
  } else {
    throw new Error('There is no "' + name + '" error');
  }
};
