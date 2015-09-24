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

var parseNestedFieldName = function(nestedFieldName, definition) {
  var segments = nestedFieldName.split('.');

  if (segments[0] === '$' || segments[segments.length - 1] === '$') {
    throw new Error(
      'The "$" sign can not be placed at the beginning or end of the "' +
      nestedFieldName + '" nested field pattern'
    );
  }

  var fieldsDefinitions = {};
  var schemaDefinition = fieldsDefinitions;
  var className = '';
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    var nextSegment = segments[i + 1];

    if (i < segments.length - 1) {
      var nestedFieldDefinition = {};
      if (nextSegment === '$') {
        nestedFieldDefinition.type = 'array';
        nestedFieldDefinition.name = segment;
        i++;
      } else {
        nestedFieldDefinition.type = 'object';
        nestedFieldDefinition.name = segment;
      }
      className += Astro.utils.string.ucfirst(segment);
      nestedFieldDefinition.nested = {
        name: className,
        fields: {}
      };
      fieldsDefinitions[segment] = nestedFieldDefinition;
      fieldsDefinitions = nestedFieldDefinition.nested.fields;
    } else {
      fieldsDefinitions[segment] = definition;
    }
  }

  return schemaDefinition[segments[0]];
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
            if (Astro.utils.fields.isNestedFieldName(fieldName)) {
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
            if (fieldsDefinitions[fieldDefinition.name]) {
              // If a field definition already exists, then try deep merging
              // these definitions.
              fieldsDefinitions[fieldDefinition.name] =
                Astro.utils.object.deepMerge(
                  fieldsDefinitions[fieldDefinition.name], fieldDefinition
                );
            } else {
              fieldsDefinitions[fieldDefinition.name] = fieldDefinition;
            }
          }
        });

      } else if (_.isObject(schemaDefinition.fields)) {

        _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
          var fieldDefinition;

          if (_.isString(fieldDefinition)) {

            if (Astro.utils.fields.isNestedFieldName(fieldName)) {
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

            if (Astro.utils.fields.isNestedFieldName(fieldName)) {
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
            if (fieldsDefinitions[fieldDefinition.name]) {
              // If a field definition already exists, then try deep merging
              // these definitions.
              fieldsDefinitions[fieldDefinition.name] =
                Astro.utils.object.deepMerge(
                  fieldsDefinitions[fieldDefinition.name], fieldDefinition
                );
            } else {
              fieldsDefinitions[fieldDefinition.name] = fieldDefinition;
            }
          }
        });

      }

      if (_.size(fieldsDefinitions) > 0) {
        schemaDefinition.fields = fieldsDefinitions;
      }
    }
  }
);
