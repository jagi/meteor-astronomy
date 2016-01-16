const fieldProps = ['name', 'default', 'optional', 'immutable', 'transient'];

Astro.Module.modules.fields.onApplyDefinition = function(
  Class, parsedDefinition, className
) {
  _.each(parsedDefinition.fields, function(fieldDefinition, fieldName) {
    // Prepare field variable.
    let field;
    // Get type field.
    let type = fieldDefinition.type;
    // Scalar or object field.
    if (Match.test(type, Function)) {
      if (Astro.Type.contains(type)) {
        field = new Astro.ScalarField(
          _.extend(_.pick(fieldDefinition, fieldProps), {
            type: Astro.Type.getByClass(type)
          })
        );
      }
      else if (Astro.Class.contains(type)) {
        field = new Astro.ObjectField(
          _.extend(_.pick(fieldDefinition, fieldProps), {
            class: type
          })
        );
      }
    }
    // List field.
    else if (Match.test(type, [Function])) {
      if (Astro.Type.contains(type[0])) {
        field = new Astro.ListField(
          _.extend(_.pick(fieldDefinition, fieldProps), {
            type: Astro.Type.getByClass(type[0])
          })
        );
      }
      else if (Astro.Class.contains(type[0])) {
        field = new Astro.ListField(
          _.extend(_.pick(fieldDefinition, fieldProps), {
            class: type[0]
          })
        );
      }
    }

    // Add a field object to the fields list.
    Class.schema.fields[fieldName] = field;
    Class.schema.fieldsNames.push(fieldName);
  });
};
