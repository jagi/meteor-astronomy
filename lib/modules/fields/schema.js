var prototype = Astronomy.Schema.prototype;

prototype.getField = function(fieldName) {
  if (!_.isString(fieldName)) {
    return;
  }

  return this._fields[fieldName];
};

prototype.getFields = function() {
  return this._fields;
};

prototype.getFieldsNames = function(inherited) {
  inherited = inherited || false;
  var fields = [];
  var schema = this;

  while (true) {
    // Get fields names for given (current or parent) schema.
    fields = _.union(fields, _.keys(schema._fields));

    if (inherited) {
      var ParentClass = schema.getParentClass();
      if (!ParentClass) {
        break;
      }
      schema = ParentClass.schema;

      // If `inherited` flag is set to false then stop getting fields for parent classes.
    } else {
      break;
    }
  }

  return fields;
};

prototype.addField = function(fieldName, fieldDefinition) {
  if (!_.isString(fieldName)) {
    return;
  }

  if (_.isUndefined(fieldDefinition)) {
    // If `fieldDefinition` is `undefined` then set `type` and `default` to null.
    fieldDefinition = {
      type: null,
      default: null
    };
  } else if (_.isFunction(fieldDefinition)) {
    // If `fieldDefinition` is `function` then set it as a type.
    fieldDefinition = {
      type: fieldDefinition,
      default: null
    };
  } else if (_.isObject(fieldDefinition)) {
    // If `fieldDefinition` is `object` then pick only allowed `type` and
    // `default` attributes.
    fieldDefinition = _.extend({
      type: null,
      default: null
    }, _.pick(fieldDefinition, ['type', 'default']));
  }

  // Add field definition to the schema.
  var Class = this._class;
  this._fields[fieldName] = fieldDefinition;

  // Define setter and getter for given field.
  Object.defineProperty(Class.prototype, fieldName, {
    get: function() {
      return this.get(fieldName);
    },
    set: function(value) {
      this.set(fieldName, value);
    }
  });
};

prototype.addFields = function(fields) {
  if (_.isArray(fields)) {
    for (var i = 0, length = fields.length; i < length; i++) {
      this.addField(fields[i], null);
    }
  } else if (_.isObject(fields)) {
    for (var fieldName in fields) {
      this.addField(fieldName, fields[fieldName]);
    }
  }
};
