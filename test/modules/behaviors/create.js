Tinytest.add('Modules - Behaviors - Create', function(test) {
	reset();

	let CustomBehavior = Astro.Behavior.create({
		name: 'custom',
		options: {
			fieldName: 'behaviorField'
		},
		createClassDefinition: function() {
			let behavior = this;

			let definition = {
				fields: {}
			};

			definition.fields[behavior.options.fieldName] = {
				type: String,
				default: 'defaultValue'
			};

			return definition;
		}
	});

  test.isTrue(
		Astro.Behavior.prototype.isPrototypeOf(CustomBehavior.prototype),
    'Behavior not created'
  );
});
