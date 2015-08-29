Tinytest.add('Events - Order', function(test) {
  // Reset Astronomy.
  reset();

  var EventsOrders = new Mongo.Collection(null);
  var EventsOrder = Astro.Class({
    name: 'EventsOrder',
    collection: EventsOrders,
    fields: ['childField'],
    events: {
      beforeInit: function() {
        actualEventsList.push('beforeInit 1');
      },
      afterInit: function() {
        actualEventsList.push('afterInit 1');
      },
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

  EventsOrder.addEvents({
    beforeInit: function() {
      actualEventsList.push('beforeInit 2');
    },
    afterInit: function() {
      actualEventsList.push('afterInit 2');
    },
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

  Astro.eventManager.on('beforeInit', function() {
    actualEventsList.push('beforeInit global');
  });
  Astro.eventManager.on('afterInit', function() {
    actualEventsList.push('afterInit global');
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

  var actualEventsList = [];
  var expectedEventsList = [
    'beforeInit 1',
    'beforeInit 2',
    'beforeInit global',
    'afterInit 1',
    'afterInit 2',
    'afterInit global',
    'beforeSave 1',
    'beforeSave 2',
    'beforeSave global',
    'beforeInsert 1',
    'beforeInsert 2',
    'beforeInsert global',
    'afterInsert 1',
    'afterInsert 2',
    'afterInsert global',
    'afterSave 1',
    'afterSave 2',
    'afterSave global'
  ];
  var event = new EventsOrder();
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a document insert'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSave 1',
    'beforeSave 2',
    'beforeSave global',
    'beforeUpdate 1',
    'beforeUpdate 2',
    'beforeUpdate global'
  ];
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a document update without a change'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSet 1',
    'beforeSet 2',
    'beforeSet global',
    'afterSet 1',
    'afterSet 2',
    'afterSet global',
    'beforeGet 1',
    'beforeGet 2',
    'beforeGet global',
    'afterGet 1',
    'afterGet 2',
    'afterGet global',
    'beforeSave 1',
    'beforeSave 2',
    'beforeSave global',
    'beforeUpdate 1',
    'beforeUpdate 2',
    'beforeUpdate global',
    'afterUpdate 1',
    'afterUpdate 2',
    'afterUpdate global',
    'afterSave 1',
    'afterSave 2',
    'afterSave global'
  ];
  event.set('childField', 'update');
  event.get('childField');
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a document update after a change'
  );
});
