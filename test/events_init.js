Tinytest.add('Events - Init', function(test) {
  Astro.classes = [];

  Events = new Mongo.Collection(null);

  actualEventsList;
  expectedEventsList;

  Event = Astro.Class({
    name: 'Event',
    collection: Events,
    fields: {
      childField: {
        type: 'string',
        default: null
      }
    },
    events: {
      beforeSet: function() {
        actualEventsList.push('beforeSet 1');
      },
      afterSet: function() {
        actualEventsList.push('afterSet 1');
      },
      beforeGet: function() {
        actualEventsList.push('beforeGet 1');
      },
      afterGet: function() {
        actualEventsList.push('afterGet 1');
      },
      beforeSave: function() {
        actualEventsList.push('beforeSave 1');
      },
      afterSave: function() {
        actualEventsList.push('afterSave 1');
      },
      beforeInsert: function() {
        actualEventsList.push('beforeInsert 1');
      },
      afterInsert: function() {
        actualEventsList.push('afterInsert 1');
      },
      beforeUpdate: function() {
        actualEventsList.push('beforeUpdate 1');
      },
      afterUpdate: function() {
        actualEventsList.push('afterUpdate 1');
      }
    }
  });

  Event.addEvents({
    beforeSet: function() {
      actualEventsList.push('beforeSet 2');
    },
    afterSet: function() {
      actualEventsList.push('afterSet 2');
    },
    beforeGet: function() {
      actualEventsList.push('beforeGet 2');
    },
    afterGet: function() {
      actualEventsList.push('afterGet 2');
    },
    beforeSave: function() {
      actualEventsList.push('beforeSave 2');
    },
    afterSave: function() {
      actualEventsList.push('afterSave 2');
    },
    beforeInsert: function() {
      actualEventsList.push('beforeInsert 2');
    },
    afterInsert: function() {
      actualEventsList.push('afterInsert 2');
    },
    beforeUpdate: function() {
      actualEventsList.push('beforeUpdate 2');
    },
    afterUpdate: function() {
      actualEventsList.push('afterUpdate 2');
    }
  });

  Astro.eventManager.on('beforeSet', function() {
    actualEventsList.push('beforeSet global');
  });
  Astro.eventManager.on('afterSet', function() {
    actualEventsList.push('afterSet global');
  });
  Astro.eventManager.on('beforeGet', function() {
    actualEventsList.push('beforeGet global');
  });
  Astro.eventManager.on('afterGet', function() {
    actualEventsList.push('afterGet global');
  });
  Astro.eventManager.on('beforeSave', function() {
    actualEventsList.push('beforeSave global');
  });
  Astro.eventManager.on('afterSave', function() {
    actualEventsList.push('afterSave global');
  });
  Astro.eventManager.on('beforeInsert', function() {
    actualEventsList.push('beforeInsert global');
  });
  Astro.eventManager.on('afterInsert', function() {
    actualEventsList.push('afterInsert global');
  });
  Astro.eventManager.on('beforeUpdate', function() {
    actualEventsList.push('beforeUpdate global');
  });
  Astro.eventManager.on('afterUpdate', function() {
    actualEventsList.push('afterUpdate global');
  });
  Astro.eventManager.on('beforeRemove', function() {
    actualEventsList.push('beforeRemove global');
  });
  Astro.eventManager.on('afterRemove', function() {
    actualEventsList.push('afterRemove global');
  });
});
