var checks = {};

checks.methodName = function(methodName) {
  if (!_.isString(methodName)) {
    throw new Error(
      'The method name in the "' + this.getName() +
      '" class schema has to be a string'
    );
  }
};

checks.method = function(methodName, method) {
  if (!_.isFunction(method)) {
    throw new Error(
      'The "' + methodName + '" method in the "' + this.getName() +
      '" class schema has to be a function'
    );
  }
};

checks.methods = function(methods) {
  if (!_.isObject(methods)) {
    throw new Error(
      'The methods definition in the "' + this.getName() +
      '" class schema has to be an object'
    );
  }
};

var methods = {};

methods.addMethod = function(methodName, method) {
  // Check if the method name is a string.
  checks.methodName.call(this, methodName);
  // Check if method is a function.
  checks.method.call(this, methodName, method);

  this.prototype[methodName] = method;
};

methods.addMethods = function(methods) {
  checks.methods.call(this, methods);

  _.each(methods, function(method, methodName) {
    this.addMethod(methodName, method);
  }, this);
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  if (_.has(schemaDefinition, 'methods')) {
    Class.addMethods(schemaDefinition.methods);
  }
});
