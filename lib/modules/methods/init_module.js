methodsOnInitModule = function() {
  var prototype = Astro.Schema.prototype;

  prototype.getMethod = function(methodName) {
    if (!_.isString(methodName)) {
      return;
    }

    return this._methods[methodName];
  };

  prototype.getMethods = function() {
    return this._methods;
  };

  prototype.addMethod = function(methodName, method) {
    if (!_.isString(methodName)) {
      return;
    }
    if (!_.isFunction(method)) {
      return;
    }

    this._methods[methodName] = method;
    this._class.prototype[methodName] = method;
  };

  prototype.addMethods = function(methods) {
    if (!_.isObject(methods)) {
      return;
    }

    for (var methodName in methods) {
      if (methods.hasOwnProperty(methodName)) {
        this.addMethod(methodName, methods[methodName]);
      }
    }
  };
};
