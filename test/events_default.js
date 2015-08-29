Tinytest.add('Events - Default', function(test) {
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

  var eventsPropagation = new EventsDefault({
    prevent: true
  });
  eventsPropagation.save();
  test.isNull(eventsPropagation._id,
    'Execution of the action should be prevented'
  );

  eventsPropagation.set('prevent', false);
  eventsPropagation.save();
  test.isNotNull(eventsPropagation._id,
    'Execution of the action should not be prevented'
  );
});
