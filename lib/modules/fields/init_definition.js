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
};

Astro.eventManager.on(
  'initDefinition', function onInitDefinitionFields(schemaDefinition) {
    var className = schemaDefinition.className;

    if (_.has(schemaDefinition, 'fields')) {
      var fieldsDefinitions = {};

      if (_.isArray(schemaDefinition.fields)) {
        _.each(schemaDefinition.fields, function(fieldName) {
          fieldsDefinitions[fieldName] = {
            name: fieldName,
            type: 'null'
          };
          // Check validity of the field definition.
          checkFieldDefinition(
            fieldsDefinitions[fieldName], className
          );
        });
      } else if (_.isObject(schemaDefinition.fields)) {
        _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
          if (_.isString(fieldDefinition)) {
            fieldsDefinitions[fieldName] = {
              name: fieldName,
              type: fieldDefinition
            };
            // Check validity of the field definition.
            checkFieldDefinition(
              fieldsDefinitions[fieldName], className
            );
          } else if (_.isObject(fieldDefinition)) {
            fieldsDefinitions[fieldName] = _.extend({
              type: 'null'
            }, fieldDefinition, {
              name: fieldName
            });
            // Check validity of the field definition.
            checkFieldDefinition(
              fieldsDefinitions[fieldName], className
            );
          }
        });
      }

      schemaDefinition.fields = fieldsDefinitions;
    }
  }
);
