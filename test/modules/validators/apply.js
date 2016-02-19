Tinytest.add('Modules - Validators - Apply', function(test) {
	const validators = [{
		type: 'custom',
		param: 'abc'
	}];

	let ClassValidator = Astro.Class.create({
		name: 'ClassValidator',
		fields: {
			name: {
				type: String,
				validators: validators
			}
		}
	});

	test.equal(
		ClassValidator.getValidators('name'), validators,
		'Validator not applied'
	);
});