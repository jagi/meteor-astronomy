Schema.prototype.getField = function(fieldName) {
  if (!_.isString(fieldName)) {
    return;
  }

  return this._fields[fieldName];
};

Schema.prototype.getFields = function() {
  return this._fields;
};

Schema.prototype.getFieldsNames = function(inherited) {
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

Schema.prototype.addField = function(fieldName, fieldValue) {
  if (!_.isString(fieldName)) {
    return;
  }

  var Cls = this._class;
  this._fields[fieldName] = fieldValue;
  Object.defineProperty(Cls.prototype, fieldName, {
    get: function() {
      return this.get(fieldName);
    },
    set: function(value) {
      this.set(fieldName, value);
    }
  });
};

Schema.prototype.addFields = function(fields) {
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
