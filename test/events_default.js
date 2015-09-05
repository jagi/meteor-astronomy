Tinytest.add('Events - Preventing default', function(test) {
  // Reset Astronomy.
  reset();

  var EventsDefaults = new Mongo.Collection(null);
  var EventsDefault = Astro.Class({
    name: 'EventsDefault',
    collection: EventsDefaults,
    fields: ['prevent'],
    events: {
      beforeSave: function(e) {
        if (this.get('prevent')) {
          e.preventDefault();
        }
      }
    }
  });

  var eventsDefault = new EventsDefault({
    prevent: true
  });
  eventsDefault.save();
  test.isNull(eventsDefault._id,
    'Execution of the action should be prevented'
  );

  eventsDefault.set('prevent', false);
  eventsDefault.save();
  test.isNotNull(eventsDefault._id,
    'Execution of the action should not be prevented'
  );
});
