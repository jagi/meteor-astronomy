import { Class, ValidationError } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Fields - Optional', function(test) {
  reset();

  // Define simple class to work with.
  const Optional = Class.create({
    name: 'Optional',
    fields: {
      optional: {
        type: String,
        optional: true,
      },
      resolveOptional: {
        type: String,
        optional(doc) {
          return true;
        },
      },
      required: {
        type: String,
      },
    }
  });

  const optional = new Optional();
  let error;

  try {
    optional.validate({
      fields: ['optional'],
    });
  }
  catch (err) {
    error = err;
  }
  finally {
    test.isUndefined(
      error,
      'The "optional" field should be optional',
    );
  }

  try {
    optional.validate({
      fields: ['resolveOptional'],
    });
  }
  catch (err) {
    error = err;
  }
  finally {
    test.isUndefined(
      error,
      'The "resolveOptional" field should be resolved as optional',
    );
  }

  try {
    optional.validate({
      fields: ['required'],
    });
  }
  catch (err) {
    error = err;
  }
  finally {
    test.isTrue(
      ValidationError.is(error),
      'The "required" field should be required',
    );
  }
});