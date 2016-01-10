Astro.Module.modules.fields.onApplyDefinition = function(
  Class, parsedSchema, className
) {
  let schema = Class.schema;
  let fieldProps = ['name', 'default', 'optional', 'immutable', 'transient'];

  _.each(parsedSchema.fields, function(fieldDefinition, fieldName) {
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
    schema.fields[fieldName] = field;
    schema.fieldsNames.push(fieldName);
  });

  // Add methods to the class prototype.
  _.extend(
    Class.prototype, Astro.Module.modules.fields.classPrototypeMethods
  );
};
