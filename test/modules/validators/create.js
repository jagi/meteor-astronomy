Tinytest.add('Modules - Validators - Create', function(test) {
	reset();

	let CustomValidator = Astro.Validator.create({
	  name: 'custom',
	  isValid({ value, param }) {
			return value === param;
	  },
	  resolveError({ name, param }) {
	    return `"${name}" has to be equal ${param}`;
	  }
	});

  test.instanceOf(
		Astro.Validator.validators.custom, Astro.Validator,
    'Validator not created'
  );

	test.instanceOf(
		Astro.Validators.custom, Function,
		'Validation function not created'
	);

	test.instanceOf(
		CustomValidator, Function,
		'Validation function not returned during creation'
	);
});
