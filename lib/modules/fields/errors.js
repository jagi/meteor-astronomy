_.extend(Astro.errors._errors, {
  'fields.not_defined_field': 'Trying to set the "{0}" field that does not exist in the "{1}" class',
  'fields.not_exist': 'The "{0}" field type does not exist',
  'fields.field_name_is_string': 'The field name in the "{0}" class has to be a string',
  'fields.field_name_not_allowed_characters': 'The "{0}" field name in the "{1}" class contains not allowed characters',
  'fields.already_defined': 'The "{0}" field has already been defined in the "{1}" class',
  'fields.field_definition': 'The definition of the "{0}" field in the "{1}" class has to be a string, an object or left empty',
  'fields.fields_definitions': 'The list of fields in the "{0}" class has to be an array or an object'
});
