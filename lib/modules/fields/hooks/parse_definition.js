Astro.Module.modules.fields.onParseDefinition = function(
  definition, className
) {
  let parsedDefinition = {};

  // Check existence and validity of the "fields" property.
  parsedDefinition.fields = {};
  if (_.has(definition, 'fields')) {

    if (!Match.test(definition.fields, Match.OneOf(Object, [String]))) {
      Astro.utils.core.throwParseError([
        {class: className}, {property: 'fields'},
        'The definition has to be an array of strings or an object'
      ]);
    }

    if (_.isArray(definition.fields)) {
      _.each(definition.fields, function(fieldName) {
        var fieldDefinition = {
          name: fieldName,
          type: null
        };

        parsedDefinition.fields[fieldDefinition.name] = fieldDefinition;
      });

    } else if (_.isObject(definition.fields)) {

      _.each(definition.fields, function(fieldDefinition, fieldName) {
        if (_.isString(fieldDefinition)) {
          fieldDefinition = {
            name: fieldName,
            type: fieldDefinition
          };
        } else if (_.isObject(fieldDefinition)) {
          fieldDefinition = _.extend({
            type: null
          }, fieldDefinition, {
            name: fieldName
          });
        } else if (fieldDefinition === null) {
          fieldDefinition = {
            name: fieldName,
            type: null
          };
        }

        parsedDefinition.fields[fieldDefinition.name] = fieldDefinition;
      });

    }
  }

  // Check existence and validity of the "nested" property.
  parsedDefinition.nested = {};
  if (_.has(definition, 'nested')) {

    if (!Match.test(definition.nested, Object)) {
      Astro.utils.core.throwParseError([
        {class: className}, {property: 'nested'},
        'The definition has to be an object'
      ]);
    }

    _.each(definition.nested, function(fieldDefinition, fieldName) {
      fieldDefinition = _.extend(fieldDefinition, {
        name: fieldName
      });

      parsedDefinition.nested[fieldDefinition.name] = fieldDefinition;
    });

  }

  return parsedDefinition;
};
