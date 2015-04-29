Tinytest.add('EventsOrder order', function(test) {
  var EventsOrders = new Mongo.Collection(null);
  var EventsOrder = Astro.Class({
    name: 'EventsOrder',
    collection: EventsOrders,
    transform: true,
    fields: {
      events: {
        type: 'array',
        default: []
      }
    },
    events: {
      beforeSave: function() {
        this.field.push('beforeSave');
      },
      afterSave: function() {
        this.field.push('afterSave');
      },
      beforeInsert: function() {
        this.field.push('beforeInsert');
      },
      afterInsert: function() {
        this.field.push('afterInsert');
      },
      beforeUpdate: function() {
        this.field.push('beforeUpdate');
      },
      afterUpdate: function() {
        this.field.push('afterUpdate');
      },
    }
  });
  var eventsOrder = new EventsOrder();
  eventsOrder.save();

  // test.equal(eventsOrder.events, '123',
  //   'The "events" field\'s value should be "123"'
  // );
});
