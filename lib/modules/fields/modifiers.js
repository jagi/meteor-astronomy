var proto = Astro.BaseClass.prototype;

var modifiersList = ['$set', '$push', '$pop', '$pullAll', '$inc'];

// Utils.

proto._executeModifier = function(modifier) {
  var doc = this;

  if (_.isObject(modifier.$set)) {
    // For each $set modifier, we assign a given value to a field.
    _.each(modifier.$set, function(fieldValue, fieldName) {
      doc._setOne(fieldName, fieldValue);
    });
  }

  if (_.isObject(modifier.$push)) {
    // For each $push modifier, we push a given value at the end of a field.
    _.each(modifier.$push, function(pushedValue, fieldName) {
      // If the $push modifier contains the $each modifier, then we have push
      // each value of the array.
      if (_.isArray(pushedValue.$each)) {
        _.each(pushedValue.$each, function(element) {
          doc._pushOne(fieldName, element);
        });
      } else {
        doc._pushOne(fieldName, pushedValue);
      }
    });
  }

  if (_.isObject(modifier.$inc)) {
    // For each $inc modifier, we increment a given value to of a field.
    _.each(modifier.$inc, function(incAmount, fieldName) {
      doc._incOne(fieldName, incAmount);
    });
  }

  if (_.isObject(modifier.$pop)) {
    // For each $pop modifier, we pop the first or last value of a field.
    _.each(modifier.$pop, function(popSide, fieldName) {
      doc._popOne(fieldName, popSide);
    });
  }
};

proto._addModifier = function(modifierName, fieldName, fieldValue) {
  var doc = this;

  var modifierFunctions = {
    $set: function() {
      doc._modifiers.$set[fieldName] = fieldValue;
      return true;
    },
    $push: function() {
      // First, we check whether there is already the $push modifier for the
      // given field name.
      if (_.has(doc._modifiers.$push, fieldName)) {
        if (_.has(doc._modifiers.$push[fieldName], '$each')) {
          doc._modifiers.$push[fieldName].$each.push(fieldValue);
        } else {
          doc._modifiers.$push[fieldName] = {
            $each: [
              doc._modifiers.$push[fieldName],
              fieldValue
            ]
          };
        }
      } else {
        doc._modifiers.$push[fieldName] = fieldValue;
      }
      return true;
    },
    $inc: function() {
      // First, we check whether there is already the $inc modifier for a given
      // field name.
      if (_.has(doc._modifiers.$inc, fieldName)) {
        doc._modifiers.$inc[fieldName] += fieldValue;
      } else {
        doc._modifiers.$inc[fieldName] = fieldValue;
      }
      return true;
    },
    $pop: function() {
      // First, we check whether there is already the $pop modifier for a given
      // field name.
      if (_.has(doc._modifiers.$pop, fieldName)) {
        return false;
      }
      doc._modifiers.$pop[fieldName] = fieldValue;
      return true;
    },
    $pullAll: function() {
      if (_.has(doc._modifiers.$pullAll, fieldName)) {
        doc._modifiers.$pullAll[fieldName].push(fieldValue);
      } else {
        doc._modifiers.$pullAll = {};
        doc._modifiers.$pullAll[fieldName] = [];
        doc._modifiers.$pullAll[fieldName].push(fieldValue);
      }
      return true;
    }
  };

  // Check whether a given modifier is allowed.
  if (!_.contains(modifiersList, modifierName)) {
    return false;
  }

  // If there is already any modifier for the same field then stop here.
  // In MongoDB we can not execute multiple modifiers for the same field.
  if (_.some(_.without(modifiersList, modifierName), function(modifierName) {
    return doc._hasModifier(modifierName, fieldName);
  })) {
    return false;
  }

  // Create a modifier group if does not exist.
  doc._modifiers[modifierName] = doc._modifiers[modifierName] || {};

  // Execute a modifier function.
  return modifierFunctions[modifierName]();
};

proto._clearModifiers = function() {
  var doc = this;
  var Class = doc.constructor;

  doc._modifiers = {};

  // Get modifiers for nested fields.
  var fieldsNames = Class.getFieldsNames();
  // Loop through class fields and for each one check if it is a nested field.
  _.each(fieldsNames, function(fieldName) {
    // Get a definition of a field.
    var field = Class.getField(fieldName);

    // We can not look for a modifier in a nested field that it's empty.
    if (_.isNull(doc[fieldName])) {
      return;
    }

    if (field instanceof Astro.fields.object && field.class) {
      // One nested doc.

      // Get a nested document.
      var nestedDoc = doc[fieldName];
      // Clear nested modifiers.
      nestedDoc._clearModifiers();
    } else if (field instanceof Astro.fields.array && field.class) {
      // Many nested docs.

      // Get nested documents.
      var nestedDocs = doc[fieldName];
      _.each(nestedDocs, function(nestedDoc, nestedDocIndex) {
        // Clear nested modifiers.
        nestedDoc._clearModifiers();
      });
    }
  });
};

proto._hasModifier = function(modifier, fieldName) {
  if (arguments.length === 1) {
    return _.has(this._modifiers, modifier);
  } else if (arguments.length === 2) {
    return _.has(this._modifiers, modifier) &&
      _.has(this._modifiers[modifier], fieldName);
  }
};

proto._getModifier = function(modifierName, fieldName) {
  var doc = this;

  var result = {};

  if (!doc._hasModifier.apply(doc, arguments)) {
    return result;
  }

  if (_.isUndefined(fieldName)) {
    _.each(doc._modifiers[modifierName], function(modifierValue, fieldName) {
      // Get an original value of the field.
      var originalValue;
      Astro.utils.fields.traverseNestedDocs(
        doc._original,
        fieldName,
        function(nestedField, nestedFieldName, Class, field, index) {
          originalValue = _.isUndefined(index) ?
            nestedField[nestedFieldName] : nestedField[nestedFieldName][index];
        }
      );

      // Get a current value of the field.
      var fieldValue;
      Astro.utils.fields.traverseNestedDocs(
        doc,
        fieldName,
        function(nestedField, nestedFieldName, Class, field, index) {
          fieldValue = _.isUndefined(index) ?
            nestedField[nestedFieldName] : nestedField[nestedFieldName][index];
        }
      );

      // If a value has changed then get the modifier.
      if (!EJSON.equals(originalValue, fieldValue)) {
        result[fieldName] = modifierValue;
      }
    });
  } else {
    result[fieldName] = doc._modifiers[modifierName][fieldName];
  }

  return result;
};

proto._getModifiers = function(nested) {
  var doc = this;
  var Class = doc.constructor;

  nested = _.isUndefined(nested) ? true : nested;

  var docModifiers = {};

  // Collect all modifiers.
  _.each(modifiersList, function(modifierName) {
    var modifier = doc._getModifier(modifierName);
    if (_.size(modifier) > 0) {
      docModifiers[modifierName] = modifier;
    }
  });

  if (!nested) {
    return docModifiers;
  }

  // Get modifiers for nested fields.
  var fieldsNames = Class.getFieldsNames();
  // Loop through class fields and for each one check if it is a nested field.
  _.each(fieldsNames, function(fieldName) {
    // Get a definition of a field.
    var field = Class.getField(fieldName);

    // We can not look for a modifier in a nested field that it's empty.
    if (_.isNull(doc[fieldName])) {
      return;
    }

    // One nested doc.
    if (field instanceof Astro.fields.object && field.class) {

      // Get a nested document.
      var nestedDoc = doc[fieldName];
      // Get a modifier for a nested document.
      var nestedDocModifier = nestedDoc._getModifiers();
      // We have to loop through modifiers list and check if some modifiers
      // already exist in the parent modifier. If so, then we will try to merge
      // them.
      _.each(nestedDocModifier, function(nestedFieldsValues, modifierName) {
        _.each(nestedFieldsValues, function(nestedFieldValue, nestedFieldName) {
          docModifiers[modifierName] = docModifiers[modifierName] || {};
          var fullFieldName = fieldName + '.' + nestedFieldName;
          docModifiers[modifierName][fullFieldName] = nestedFieldValue;
        });
      });

      // Many nested docs.
    } else if (field instanceof Astro.fields.array && field.class) {

      // Get nested documents.
      var nestedDocs = doc[fieldName];
      _.each(nestedDocs, function(nestedDoc, nestedDocIndex) {
        // Get a modifier for a nested document.
        var nestedDocModifier = nestedDoc._getModifiers();
        // We have to loop through modifiers list and check if some modifiers
        // already exist in the parent modifier. If so, then we will try to
        // merge them.
        _.each(nestedDocModifier, function(nestedFieldsValues, modifierName) {
          _.each(nestedFieldsValues, function(
            nestedFieldValue, nestedFieldName
          ) {
            docModifiers[modifierName] = docModifiers[modifierName] || {};
            var fullFieldName =
              fieldName + '.' + nestedDocIndex + '.' + nestedFieldName;
            docModifiers[modifierName][fullFieldName] = nestedFieldValue;
          });
        });
      });

    }
  });

  return docModifiers;
};

proto._hasModifier = function(modifier, fieldName) {
  if (arguments.length === 1) {
    return _.has(this._modifiers, modifier);
  } else if (arguments.length === 2) {
    return _.has(this._modifiers, modifier) &&
      _.has(this._modifiers[modifier], fieldName);
  }
};

proto._removeModifier = function(modifier, fieldName) {
  // If a modifier is not present, then stop here.
  if (!this._hasModifier.apply(this, arguments)) {
    return;
  }

  if (arguments.length === 1) {
    this._modifiers[modifier] = {};
  } else if (arguments.length === 2) {
    this._modifiers[modifier][fieldName] = {};
  }
};
