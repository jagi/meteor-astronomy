import { Class, Field } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Behaviors - Apply', function(test) {
	let ClassBehavior1 = Class.create({
		name: 'ClassBehavior1',
		behaviors: ['custom']
	});

	let ClassBehavior2 = Class.create({
		name: 'ClassBehavior2',
		behaviors: {
			custom: {}
		}
	});

	let ClassBehavior3 = Class.create({
		name: 'ClassBehavior3',
		behaviors: {
			custom: {
				fieldName: 'anotherField'
			}
		}
	});

	test.instanceOf(
		ClassBehavior1.getField('behaviorField'), Field,
		'Behaviors list as an array of strings not applied'
	);

	test.instanceOf(
		ClassBehavior2.getField('behaviorField'), Field,
		'Behavior list as an object of options not applied'
	);

	test.instanceOf(
		ClassBehavior3.getField('anotherField'), Field,
		'Behavior list as an object of options with custom option not applied'
	);
});