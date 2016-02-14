Tinytest.add('Events - Modules - Order', function(test) {
	let executedEvents = [];
	let expectedEvents = [];

	let OrderNestedEvent = Astro.Class.create({
		name: 'OrderNestedEvent',
		events: {
			beforeInit: function(e) {
				executedEvents.push('ONE.beforeInit');
			},
			afterInit: function(e) {
				executedEvents.push('ONE.afterInit');
			},
			beforeSave: function(e) {
				executedEvents.push('ONE.beforeSave');
			},
			afterSave: function(e) {
				executedEvents.push('ONE.afterSave');
			},
			beforeInsert: function(e) {
				executedEvents.push('ONE.beforeInsert');
			},
			afterInsert: function(e) {
				executedEvents.push('ONE.afterInsert');
			},
			beforeUpdate: function(e) {
				executedEvents.push('ONE.beforeUpdate');
			},
			afterUpdate: function(e) {
				executedEvents.push('ONE.afterUpdate');
			}
		}
	});

	let OrderEvents = new Mongo.Collection(null);

	let OrderEvent = Astro.Class.create({
		name: 'OrderEvent',
		collection: OrderEvents,
		fields: {
			one: {
				type: OrderNestedEvent,
				default: function() {
					return new OrderNestedEvent();
				}
			},
			many: {
				type: [OrderNestedEvent],
				default: function() {
					return [new OrderNestedEvent()];
				}
			},
			string: {
				type: String,
				optional: true
			}
		},
		events: {
			beforeInit: function(e) {
				executedEvents.push('OE.beforeInit');
			},
			afterInit: function(e) {
				executedEvents.push('OE.afterInit');
			},
			beforeSave: function(e) {
				executedEvents.push('OE.beforeSave');
			},
			afterSave: function(e) {
				executedEvents.push('OE.afterSave');
			},
			beforeInsert: function(e) {
				executedEvents.push('OE.beforeInsert');
			},
			afterInsert: function(e) {
				executedEvents.push('OE.afterInsert');
			},
			beforeUpdate: function(e) {
				executedEvents.push('OE.beforeUpdate');
			},
			afterUpdate: function(e) {
				executedEvents.push('OE.afterUpdate');
			}
		}
	});

	// Document creation.
	executedEvents = [];
	expectedEvents = [
		'OE.beforeInit',
		'ONE.beforeInit',
		'ONE.afterInit',
		'ONE.beforeInit',
		'ONE.afterInit',
		'OE.afterInit',
	];
	let event = new OrderEvent();
	test.equal(executedEvents, expectedEvents,
		'Wrong events order on a document creation'
	);

	// Document insertion.
	executedEvents = [];
	expectedEvents = [
		'OE.beforeSave',
		'ONE.beforeSave',
		'ONE.beforeSave',
		'OE.beforeInsert',
		'ONE.beforeInsert',
		'ONE.beforeInsert',
		'OE.afterInsert',
		'ONE.afterInsert',
		'ONE.afterInsert',
		'OE.afterSave',
		'ONE.afterSave',
		'ONE.afterSave'
	];
	event.save();
	test.equal(executedEvents, expectedEvents,
		'Wrong events order on a document insert'
	);

	// Document update without changes.
	executedEvents = [];
	expectedEvents = [
		'OE.beforeInit',
		'ONE.beforeInit',
		'ONE.afterInit',
		'ONE.beforeInit',
		'ONE.afterInit',
		'OE.afterInit'
	];
	event.save();
	test.equal(executedEvents, expectedEvents,
		'Wrong events order on a document update without changes'
	);

	// Document update with changes.
	executedEvents = [];
	expectedEvents = [
		'OE.beforeInit',
		'ONE.beforeInit',
		'ONE.afterInit',
		'ONE.beforeInit',
		'ONE.afterInit',
		'OE.afterInit',
		'OE.beforeSave',
		'ONE.beforeSave',
		'ONE.beforeSave',
		'OE.beforeUpdate',
		'ONE.beforeUpdate',
		'ONE.beforeUpdate',
		'OE.beforeInit',
		'ONE.beforeInit',
		'ONE.afterInit',
		'ONE.beforeInit',
		'ONE.afterInit',
		'OE.afterInit',
		'OE.afterUpdate',
		'ONE.afterUpdate',
		'ONE.afterUpdate',
		'OE.afterSave',
		'ONE.afterSave',
		'ONE.afterSave'
	];
	event.string = 'abc';
	event.save();
	test.equal(executedEvents, expectedEvents,
		'Wrong events order on a document update with changes'
	);
});
