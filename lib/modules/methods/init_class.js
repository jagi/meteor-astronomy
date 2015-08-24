var checkAddMethod = function(methodName, method) {
  // The method name has to be a string.
  if (!_.isString(methodName)) {
    throw new Error(
      'The method name in the "' + this.getName() + '" class has to be a string'
    );
  }
  // The method has to be a function.
  if (!_.isFunction(method)) {
    throw new Error(
      'The "' + methodName + '" method in the "' + this.getName() +
      '" class has to be a function'
    );
  }
};

var checkAddMethods = function(methods) {
  if (!_.isObject(methods)) {
    throw new Error(
      'The methods list in the "' + this.getName() +
      '" class has to be an object'
    );
  }
};

var methods = {
  addMethod: function(methodName, method) {
    checkAddMethod.apply(this, arguments);

    this.prototype[methodName] = method;
  },

  addMethods: function(methods) {
    checkAddMethods.apply(this, arguments);

    var Class = this;

    _.each(methods, function(method, methodName) {
      Class.addMethod(methodName, method);
    });
  }
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  if (_.has(schemaDefinition, 'methods')) {
    Class.addMethods(schemaDefinition.methods);
  }
});
