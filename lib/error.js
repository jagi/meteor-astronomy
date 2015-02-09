Astronomy.ValidationError = function (message) {
  this.message = message;
  this.stack = (new Error()).stack;
};

Astronomy.ValidationError.prototype = new Error();
Astronomy.ValidationError.prototype.constructor = Astronomy.ValidationError;
Astronomy.ValidationError.prototype.name = 'ValidationError';
