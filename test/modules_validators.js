Tinytest.add('Modules - Validators', function(test) {
  Validator = Astro.Class({
    name: 'Validator',
    fields: {
      'null': null,
      'string': 'String',
      'number': 'Number',
      'boolean': 'Boolean',
      'date': 'Date',
      'object': 'Object',
      'array': 'Array'
    },
    validators: {
      string: Validators.string()
    }
  });

  var validator = new Validator();

  test.isFalse(validator.validate(),
    'The validation of a document should not pass'
  );
});
