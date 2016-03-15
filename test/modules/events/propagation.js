Tinytest.add('Events - Modules - Propagation', function(test) {
  // Reset Astro.
  reset();

  let expectedEvents = [];
  let executedEvents = [];

  let PropagationNestedEvent = Astro.Class.create({
    name: 'PropagationNestedEvent',
    events: {
      beforeSave: [
        function(e) {
          executedEvents.push('PNE.beforeSave1');
        }
      ]
    }
  });

  let PropagationEvents = new Mongo.Collection(null);

  let PropagationEvent = Astro.Class.create({
    name: 'PropagationEvent',
    collection: PropagationEvents,
    fields: {
      one: {
        type: PropagationNestedEvent,
        default: function() {
          return new PropagationNestedEvent();
        }
      },
      stopPropagation: {
        type: Boolean
      },
      stopImmediatePropagation: {
        type: Boolean
      },
    },
    events: {
      beforeSave: [
        function(e) {
          var doc = e.currentTarget;
          executedEvents.push('PE.beforeSave1');
          if (doc.stopImmediatePropagation) {
            e.stopImmediatePropagation();
          }
          else if (doc.stopPropagation) {
            e.stopPropagation();
          }
        },
        function() {
          executedEvents.push('PE.beforeSave2');
        }
      ]
    }
  });

  // Propagation NOT stopped.
  executedEvents = [];
  expectedEvents = [
    'PE.beforeSave1',
    'PE.beforeSave2',
    'PNE.beforeSave1'
  ];
  let eventsPropagation = new PropagationEvent();
  eventsPropagation.stopPropagation = false;
  eventsPropagation.stopImmediatePropagation = false;
  eventsPropagation.save();
  test.equal(executedEvents, expectedEvents,
    'Events propagation should not be stopped'
  );

  // Propagation immediately stopped.
  executedEvents = [];
  expectedEvents = [
    'PE.beforeSave1'
  ];
  eventsPropagation.stopPropagation = false;
  eventsPropagation.stopImmediatePropagation = true;
  eventsPropagation.save();
  test.equal(executedEvents, expectedEvents,
    'Events propagation should be stopped immediately'
  );

  // Propagation stopped.
  executedEvents = [];
  expectedEvents = [
    'PE.beforeSave1',
    'PE.beforeSave2'
  ];
  eventsPropagation.stopPropagation = true;
  eventsPropagation.stopImmediatePropagation = false;
  eventsPropagation.save();
  test.equal(executedEvents, expectedEvents,
    'Events propagation should be stopped'
  );
});