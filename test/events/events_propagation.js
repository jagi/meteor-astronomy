Tinytest.add('Events - Propagation', function(test) {
  // Reset Astronomy.
  reset();

  var EventsPropagations = new Mongo.Collection(null);
  var EventsPropagation = Astro.Class({
    name: 'EventsPropagation',
    collection: EventsPropagations,
    fields: ['stop'],
    events: {
      beforeSave: function(e) {
        events.push('beforeSave 1');
        if (this.get('stop')) {
          e.stopPropagation();
        }
      }
    }
  });
  EventsPropagation.addEvent('beforeSave', function() {
    events.push('beforeSave 2');
  });

  var events = [];
  var eventsPropagation = new EventsPropagation();
  eventsPropagation.save();
  var expectedEvents = [
    'beforeSave 1',
    'beforeSave 2'
  ];
  test.equal(events, expectedEvents,
    'Events propagation should not be stopped'
  );

  events = [];
  eventsPropagation.set('stop', true);
  eventsPropagation.save();
  var expectedEvents = [
    'beforeSave 1'
  ];
  test.equal(events, expectedEvents,
    'Events propagation should be stopped'
  );
});
