Tinytest.add('Modules - Validators - Validate', function(test) {
  let ClassValidator = Astro.Class.create({
    name: 'ClassValidator',
    fields: {
      nameA: {
        type: String,
        validators: [{
          type: 'custom',
          param: 'abc'
        }]
      },
      nameB: {
        type: Number,
        validators: [{
          type: 'custom',
          param: 123
        }]
      }
    }
  });

  let docValidator = new ClassValidator();

  // Stop on the first error.
  docValidator.nameA = 'abc';
  docValidator.nameB = 123;
  test.isUndefined(
    docValidator.validate(),
    'Document not validated properly'
  );

  test.isUndefined(
    docValidator.validate({
      fields: 'nameA'
    }),
    'Field not validated properly'
  );

  test.isUndefined(
    docValidator.validate({
      fields: ['nameB']
    }),
    'List of fields not validated properly'
  );

  // Do not stop on the first error.
  docValidator.nameA = 'cba';
  docValidator.nameB = 321;
  try {
    docValidator.validate();
  }
  catch (e) {
    test.instanceOf(
      e, Meteor.Error,
      'Should throw Meteor.Error'
    );

    test.equal(
      e.error, Astro.ValidationError.ERROR_CODE,
      'Should throw validation error'
    );

    test.equal(
      e.details.length, 1,
      'Should throw one error'
    );

    let error = e.details[0];
    test.equal(
      error.name, 'nameA',
      'Wrong validation error'
    );
  }

  try {
    docValidator.validate({
      stopOnFirstError: false
    });
  }
  catch (e) {
    test.instanceOf(
      e, Meteor.Error,
      'Should throw Meteor.Error'
    );

    test.equal(
      e.error, Astro.ValidationError.ERROR_CODE,
      'Should throw validation error'
    );

    test.equal(
      e.details.length, 2,
      'Should throw two errors'
    );

    let errors = e.details;
    test.equal(
      errors[0].name, 'nameA',
      'Wrong validation error'
    );

    test.equal(
      errors[1].name, 'nameB',
      'Wrong validation error'
    );
  }
});