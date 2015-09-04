var proto = Astro.BaseClass.prototype;

// Utils.

proto._executeModifier = function(modifier) {
  var doc = this;

  if (modifier.$set) {
    // For each $set modifier, we assign a given value to a field.
    _.each(modifier.$set, function(fieldValue, fieldName) {
      doc._setOne(fieldName, fieldValue);
    });
  }

  if (modifier.$push) {
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

  if (modifier.$inc) {
    // For each $inc modifier, we increment a given value to of a field.
    _.each(modifier.$inc, function(incAmount, fieldName) {
      doc._incOne(fieldName, incAmount);
    });
  }
};

proto._addModifier = function(modifier, fieldName, fieldValue) {
  var doc = this;

  var modifierFunctions = {
    $set: function() {
      console.log('add SET modifier for field ' + fieldName, fieldValue);
      doc._modifier.$set[fieldName] = fieldValue;
    },
    $push: function() {
      // First, we check whether there is already the $push modifier for the
      // given field name.
      if (_.has(doc._modifier.$push, fieldName)) {
        if (_.has(doc._modifier.$push[fieldName], '$each')) {
          doc._modifier.$push[fieldName].$each.push(fieldValue);
        } else {
          doc._modifier.$push[fieldName] = {
            $each: [
              doc._modifier.$push[fieldName],
              fieldValue
            ]
          };
        }
      } else {
        doc._modifier.$push[fieldName] = fieldValue;
      }
    },
    $inc: function() {
      // First, we check whether there is already the $inc modifier for a given
      // field name.
      if (_.has(doc._modifier.$inc, fieldName)) {
        doc._modifier.$inc[fieldName] += fieldValue;
      } else {
        doc._modifier.$inc[fieldName] = fieldValue;
      }
    }
  };

  // Check whether a given modifier is allowed.
  if (!_.has(modifierFunctions, modifier)) {
    return;
  }

  // Create a modifier group if does not exist.
  doc._modifier[modifier] = doc._modifier[modifier] || {};

  // Execute a modifier function.
  modifierFunctions[modifier]();
};

proto._getModifier = function() {
  var doc = this;
  var Class = doc.constructor;

  var docModifier = {};

  // Get $set modifiers.
  if (_.has(doc._modifier, '$set')) {
    var $set = {};

    _.each(doc._modifier.$set, function(setValue, fieldName) {
      // Get an original value of the field.
      var originalValue = doc._getOriginal(fieldName);
      // Get a current value of the field.
      var fieldValue = doc._getOne(fieldName);
      // If a value has changed then get the modifier.
      if (!EJSON.equals(originalValue, fieldValue)) {
        $set[fieldName] = setValue;
      }
    });

    if (_.size($set) > 0) {
      docModifier.$set = $set;
    }
  }

  // Get $set modifiers.
  if (_.has(doc._modifier, '$push')) {
    var $push = {};

    _.each(doc._modifier.$push, function(pushedValue, fieldName) {
      // Get an original value of the field.
      var originalValue = doc._getOriginal(fieldName);
      // Get a current value of the field.
      var fieldValue = doc._getOne(fieldName);
      // If a value has changed then get the modifier.
      if (!EJSON.equals(originalValue, fieldValue)) {
        $push[fieldName] = pushedValue;
      }
    });

    if (_.size($push) > 0) {
      docModifier.$push = $push;
    }
  }

  // Get $inc modifiers.
  if (_.has(doc._modifier, '$inc')) {
    var $inc = {};

    _.each(doc._modifier.$inc, function(incAmount, fieldName) {
      // Get an original value of the field.
      var originalValue = doc._getOriginal(fieldName);
      // Get a current value of the field.
      var fieldValue = doc._getOne(fieldName);
      // If a value has changed then get the modifier.
      if (!EJSON.equals(originalValue, fieldValue)) {
        $inc[fieldName] = incAmount;
      }
    });

    if (_.size($inc) > 0) {
      docModifier.$inc = $inc;
    }
  }

  // Get modifiers for nested fields.
  var fieldsNames = Class.getFieldsNames();
  // Loop through class fields and for each one check if it is a nested field.
  _.each(fieldsNames, function(fieldName) {
    // Get a definition of a field.
    var field = Class.getField(fieldName);

    // We can not look for a modifier in a nested field that does not have a
    // defined class.
    if (field instanceof Astro.EmbedField && !field.getClass()) {
      return;
    }

    // One nested doc.
    if (field instanceof Astro.EmbedOneField) {

      // Get a nested document.
      var nestedDoc = doc[fieldName];
      // Get a modifier for a nested document.
      var nestedDocModifier = nestedDoc._getModifier();
      // We have to loop through modifiers list and check if some modifiers
      // already exist in the parent modifier. If so, then we will try to merge
      // them.
      _.each(nestedDocModifier, function(nestedFieldsValues, modifierName) {
        _.each(nestedFieldsValues, function(nestedFieldValue, nestedFieldName) {
          docModifier[modifierName] = docModifier[modifierName] || {};
          var fullFieldName = fieldName + '.' + nestedFieldName;
          docModifier[modifierName][fullFieldName] = nestedFieldValue;
        });
      });

    // Many nested docs.
    } else if (field instanceof Astro.EmbedManyField) {

      // Get nested documents.
      var nestedDocs = doc[fieldName];
      _.each(nestedDocs, function(nestedDoc, nestedDocIndex) {
        // Get a modifier for a nested document.
        var nestedDocModifier = nestedDoc._getModifier();
        // We have to loop through modifiers list and check if some modifiers
        // already exist in the parent modifier. If so, then we will try to
        // merge them.
        _.each(nestedDocModifier, function(nestedFieldsValues, modifierName) {
          _.each(nestedFieldsValues, function(
            nestedFieldValue, nestedFieldName
          ) {
            docModifier[modifierName] = docModifier[modifierName] || {};
            var fullFieldName =
              fieldName + '.' + nestedDocIndex + '.' + nestedFieldName;
            docModifier[modifierName][fullFieldName] = nestedFieldValue;
          });
        });
      });

    }
  });

  return docModifier;
};
