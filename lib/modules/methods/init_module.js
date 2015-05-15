methodsOnInitModule = function() {
  var schemaProto = Astro.Schema.prototype;

  schemaProto.getMethod = function(methodName) {
    if (!_.isString(methodName)) {
      return;
    }

    return this._methods[methodName];
  };

  schemaProto.getMethods = function() {
    return this._methods;
  };

  schemaProto.addMethod = function(methodName, method) {
    if (!_.isString(methodName)) {
      return;
    }
    if (!_.isFunction(method)) {
      return;
    }

    this._methods[methodName] = method;
    this._class.prototype[methodName] = method;
  };

  schemaProto.addMethods = function(methods) {
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
