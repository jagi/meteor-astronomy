const parseFieldDefinition = function(definition, className) {
  // Check if the field name contains allowed characters.
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(definition.name)) {
    Astro.utils.core.throwParseError([
      {class: className}, {property: 'fields'}, {field: definition.name},
      'Name of field can only contain uppercase and lowercase letters, ' +
      'digits and underscore character'
    ]);
  }
  // Check field type. It can be scalar type, class, list of scalar types or
  // list of classes.
  if (
    (
      Match.test(definition.type, Function) &&
      (
        !Astro.Type.contains(definition.type) &&
        !Astro.Class.contains(definition.type)
      )
    ) ||
    (
      Match.test(definition.type, [Function]) &&
      (
        !Astro.Type.contains(definition.type[0]) &&
        !Astro.Class.contains(definition.type[0])
      )
    )
  ) {
    Astro.utils.core.throwParseError([
      {class: className}, {property: 'fields'}, {field: definition.name},
      'Type of the field has to be scalar, class, list of scalars or list ' +
      'of classes'
    ]);
  }
};

Astro.Module.modules.fields.onParseDefinition = function(
  definition, className
) {
  let parsedDefinition = {
    fields: {}
  };

  if (_.has(definition, 'fields')) {
    // Fields definition has to be an object.
    if (!Match.test(definition.fields, Object)) {
      Astro.utils.core.throwParseError([
        {class: className}, {property: 'fields'},
        'Fields definition has to be an object'
      ]);
    }

    _.each(definition.fields, function(fieldDefinition, name) {
      if (Match.test(fieldDefinition, Match.OneOf(Function, [Function]))) {
        fieldDefinition = {
          name: name,
          type: fieldDefinition
        };
      } else if (Match.test(fieldDefinition, Object)) {
        fieldDefinition = _.extend(fieldDefinition, {
          name: name
        });
      } else {
        Astro.utils.core.throwParseError([
          {class: className}, {property: 'fields'}, {field: name},
          'Field definition has to be an object or type'
        ]);
      }

      parseFieldDefinition(fieldDefinition, className);
      parsedDefinition.fields[fieldDefinition.name] = fieldDefinition;
    });
  }

  return parsedDefinition;
};
