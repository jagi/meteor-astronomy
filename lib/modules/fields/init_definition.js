var checkFieldDefinition = function(fieldDefinition, className) {
  var fieldName = fieldDefinition.name;

  // FIELD NAME.
  // Field name has to be a string.
  if (!_.isString(fieldName)) {
    throw new TypeError(
      'The field name in the "' + className + '" class has to be a string'
    );
  }
  // Check field validity.
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName)) {
    throw new Error(
      'The "' + fieldName + '" field name in the "' + className +
      '" class contains not allowed characters'
    );
  }

  // FIELD TYPE.
  if (!Astro.fields[fieldDefinition.type]) {
    throw new Error(
      'The type provided in the definition of the "' + fieldName +
      '" field in the "' + className + '" class does not exist'
    );
  }

  // DEFAULT VALUE.
  // Check if a default value of field have been properly defined.
  if (
    !_.isFunction(fieldDefinition.default) &&
    _.isObject(fieldDefinition.default)
  ) {
    Astro.utils.warn(
      'A non plain default value for the "' + fieldName +
      '" field in the "' + className +
      '" class should be defined and returned in a function'
    );
  }
};

var isNestedFieldName = function(fieldName) {
  return fieldName.indexOf('.') !== -1 || fieldName.indexOf('$') !== -1;
};

var parseNestedFieldName = function(nestedFieldName, definition) {

};

var deepMerge = function(target, source, key) {
  var mergeKey = function(key) {
    var targetValue = target[key];
    var sourceValue = source[key];

    if (_.has(target, key)) {
      result[key] = deepMerge(targetValue, sourceValue, key);
    } else {
      if (_.isObject(sourceValue) && !_.isArray(sourceValue)) {
        result[key] = deepMerge({}, sourceValue, key);
      } else {
        result[key] = sourceValue;
      }
    }
  };

  if (_.isArray(source) && _.isArray(target)) {
    return [].concat(target, source);
  } else if (_.isObject(target) && _.isObject(source)) {
    var result = _.extend({}, target);
    _.each(_.keys(source), mergeKey);
    return result;
  } else {
    return source;
  }
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionFields(schemaDefinition) {
    var className = schemaDefinition.name;

    if (_.has(schemaDefinition, 'fields')) {
      var fieldsDefinitions = {};

      if (_.isArray(schemaDefinition.fields)) {
        _.each(schemaDefinition.fields, function(fieldName) {
          var fieldDefinition;

          if (_.isString(fieldName)) {
            if (isNestedFieldName(fieldName)) {
              fieldName = parseNestedFieldName(fieldName, {
                type: 'null'
              });
            } else {
              fieldDefinition = {
                name: fieldName,
                type: 'null'
              };
            }
          }

          if (fieldDefinition) {
            // Check validity of the field definition.
            checkFieldDefinition(fieldDefinition, className);
            if (fieldsDefinitions[fieldName]) {
              deepMerge(fieldsDefinitions[fieldName], fieldDefinition);
            } else {
              fieldsDefinitions[fieldName] = fieldDefinition;
            }
          }
        });

      } else if (_.isObject(schemaDefinition.fields)) {

        _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
          var fieldDefinition;

          if (_.isString(fieldDefinition)) {

            if (isNestedFieldName(fieldName)) {
              fieldDefinition = parseNestedFieldName(fieldName, {
                type: fieldDefinition
              });
            } else {
              fieldDefinition = {
                name: fieldName,
                type: fieldDefinition
              };
            }

          } else if (_.isObject(fieldDefinition)) {

            if (isNestedFieldName(fieldName)) {
              fieldDefinition = parseNestedFieldName(fieldName, _.extend({
                type: 'null'
              }, fieldDefinition));
            } else {
              fieldDefinition = _.extend({
                type: 'null'
              }, fieldDefinition, {
                name: fieldName
              });
            }

          }

          if (fieldDefinition) {
            // Check validity of the field definition.
            checkFieldDefinition(fieldDefinition, className);
            if (fieldsDefinitions[fieldName]) {
              deepMerge(fieldsDefinitions[fieldName], fieldDefinition);
            } else {
              fieldsDefinitions[fieldName] = fieldDefinition;
            }
          }
        });

      }

      schemaDefinition.fields = fieldsDefinitions;
    }
  }
);
