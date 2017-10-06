import { Validator, Validators } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Validators - Create', function(test) {
	reset();

	let CustomValidator = Validator.create({
	  name: 'custom',
	  isValid({ value, param }) {
			return value === param;
	  },
	  resolveError({ name, param }) {
	    return `"${name}" has to be equal ${param}`;
	  }
	});

  test.instanceOf(
		Validator.validators.custom, Validator,
    'Validator not created'
  );

	test.instanceOf(
		Validators.custom, Function,
		'Validation function not created'
	);

	test.instanceOf(
		CustomValidator, Function,
		'Validation function not returned during creation'
	);
});
