Tinytest.add('EventsOrder order', function(test) {
  var events;

  var EventsOrders = new Mongo.Collection(null);
  var EventsOrder = Astro.Class({
    name: 'EventsOrder',
    collection: EventsOrders,
    transform: true,
    fields: {
      field: {
        type: 'string',
        default: null
      }
    },
    events: {
      beforeSave: function() {
        events.push('beforeSave');
      },
      afterSave: function() {
        events.push('afterSave');
      },
      beforeInsert: function() {
        events.push('beforeInsert');
      },
      afterInsert: function() {
        events.push('afterInsert');
      },
      beforeUpdate: function() {
        events.push('beforeUpdate');
      },
      afterUpdate: function() {
        events.push('afterUpdate');
      },
    }
  });
  var eventsOrder = new EventsOrder();
  events = [];
  eventsOrder.save();

  test.equal(events, [
    'beforeSave',
    'beforeInsert',
    'afterInsert',
    'afterSave'
  ],
    'At insert events order should be: "beforeSave", "beforeInsert", ' +
    '"afterInsert", "afterSave"'
  );

  events = [];
  eventsOrder.save();

  test.equal(events, [
    'beforeSave',
    'beforeUpdate'
  ],
    'At update without a change events order should be: "beforeSave", ' +
    '"beforeUpdate"'
  );

  events = [];
  eventsOrder.field = 'update';
  eventsOrder.save();

  test.equal(events, [
    'beforeSave',
    'beforeUpdate',
    'afterUpdate',
    'afterSave'
  ],
    'At update with a change events order should be: "beforeSave", ' +
    '"beforeUpdate", "afterUpdate", "afterSave"'
  );
});
