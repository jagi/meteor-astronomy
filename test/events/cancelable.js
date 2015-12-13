Tinytest.add('Events - Cancelable', function(test) {
  let CancelableNestedEvent = Astro.Class.create({
    name: 'CancelableNestedEvent',
    events: {
      beforeSave: function(e) {
        var doc = e.target;
        if (doc.preventNested) {
          e.preventDefault();
        }
      }
    }
  });

  let CancelableEvents = new Mongo.Collection(null);

  let CancelableEvent = Astro.Class.create({
    name: 'CancelableEvent',
    collection: CancelableEvents,
    nested: {
      'one': {
        count: 'one',
        class: 'CancelableNestedEvent',
        default: function() {
          return new CancelableNestedEvent();
        }
      },
      'many': {
        count: 'many',
        class: 'CancelableNestedEvent',
        default: function() {
          return [new CancelableNestedEvent()];
        }
      }
    },
    fields: {
      'prevent': {
        type: 'boolean',
        default: false
      },
      'preventNested': {
        type: 'boolean',
        default: false
      }
    },
    events: {
      beforeSave: function(e) {
        var doc = e.currentTarget;
        if (doc.prevent) {
          e.preventDefault();
        }
      }
    }
  });

  let event = new CancelableEvent();

  // Prevent nested.
  event.prevent = false;
  event.preventNested = true;
  test.throws(
    function() {
      event.save();
    },
    'Operation prevented [403]'
  );

  // Prevent.
  event.prevent = true;
  event.preventNested = false;
  test.throws(
    function() {
      event.save();
    },
    'Operation prevented [403]'
  );

  // Do not prevent.
  event.prevent = false;
  event.preventNested = false;
  event.save();
  test.isNotNull(event._id,
    'Execution of the operation should not be prevented'
  );
});
