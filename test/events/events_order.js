Tinytest.add('Events - Order', function(test) {
  // Reset Astronomy.
  reset();

  var EventsOrders = new Mongo.Collection(null);
  var EventsOrder = Astro.Class({
    name: 'EventsOrder',
    collection: EventsOrders,
    fields: ['childField'],
    events: {
      beforeInit: function(e) {
        actualEventsList.push('beforeInit 1');
      },
      afterInit: function(e) {
        actualEventsList.push('afterInit 1');
      },
      beforeChange: function(e) {
        actualEventsList.push('beforeChange 1 (' + e.data.fieldName + ')');
      },
      beforeSet: function(e) {
        actualEventsList.push('beforeSet 1 (' + e.data.fieldName + ')');
      },
      afterSet: function(e) {
        actualEventsList.push('afterSet 1 (' + e.data.fieldName + ')');
      },
      afterChange: function(e) {
        actualEventsList.push('afterChange 1 (' + e.data.fieldName + ')');
      },
      beforeGet: function(e) {
        actualEventsList.push('beforeGet 1 (' + e.data.fieldName + ')');
      },
      afterGet: function(e) {
        actualEventsList.push('afterGet 1 (' + e.data.fieldName + ')');
      },
      beforeSave: function(e) {
        actualEventsList.push('beforeSave 1');
      },
      afterSave: function(e) {
        actualEventsList.push('afterSave 1');
      },
      beforeInsert: function(e) {
        actualEventsList.push('beforeInsert 1');
      },
      afterInsert: function(e) {
        actualEventsList.push('afterInsert 1');
      },
      beforeUpdate: function(e) {
        actualEventsList.push('beforeUpdate 1');
      },
      afterUpdate: function(e) {
        actualEventsList.push('afterUpdate 1');
      }
    }
  });

  EventsOrder.addEvents({
    beforeInit: function(e) {
      actualEventsList.push('beforeInit 2');
    },
    afterInit: function(e) {
      actualEventsList.push('afterInit 2');
    },
    beforeChange: function(e) {
      actualEventsList.push('beforeChange 2 (' + e.data.fieldName + ')');
    },
    beforeSet: function(e) {
      actualEventsList.push('beforeSet 2 (' + e.data.fieldName + ')');
    },
    afterSet: function(e) {
      actualEventsList.push('afterSet 2 (' + e.data.fieldName + ')');
    },
    afterChange: function(e) {
      actualEventsList.push('afterChange 2 (' + e.data.fieldName + ')');
    },
    beforeGet: function(e) {
      actualEventsList.push('beforeGet 2 (' + e.data.fieldName + ')');
    },
    afterGet: function(e) {
      actualEventsList.push('afterGet 2 (' + e.data.fieldName + ')');
    },
    beforeSave: function(e) {
      actualEventsList.push('beforeSave 2');
    },
    afterSave: function(e) {
      actualEventsList.push('afterSave 2');
    },
    beforeInsert: function(e) {
      actualEventsList.push('beforeInsert 2');
    },
    afterInsert: function(e) {
      actualEventsList.push('afterInsert 2');
    },
    beforeUpdate: function(e) {
      actualEventsList.push('beforeUpdate 2');
    },
    afterUpdate: function(e) {
      actualEventsList.push('afterUpdate 2');
    }
  });

  Astro.eventManager.on('beforeInit', function(e) {
    actualEventsList.push('beforeInit global');
  });
  Astro.eventManager.on('afterInit', function(e) {
    actualEventsList.push('afterInit global');
  });
  Astro.eventManager.on('beforeChange', function(e) {
    actualEventsList.push('beforeChange global (' + e.data.fieldName + ')');
  });
  Astro.eventManager.on('beforeSet', function(e) {
    actualEventsList.push('beforeSet global (' + e.data.fieldName + ')');
  });
  Astro.eventManager.on('afterSet', function(e) {
    actualEventsList.push('afterSet global (' + e.data.fieldName + ')');
  });
  Astro.eventManager.on('afterChange', function(e) {
    actualEventsList.push('afterChange global (' + e.data.fieldName + ')');
  });
  Astro.eventManager.on('beforeGet', function(e) {
    actualEventsList.push('beforeGet global (' + e.data.fieldName + ')');
  });
  Astro.eventManager.on('afterGet', function(e) {
    actualEventsList.push('afterGet global (' + e.data.fieldName + ')');
  });
  Astro.eventManager.on('beforeSave', function(e) {
    actualEventsList.push('beforeSave global');
  });
  Astro.eventManager.on('afterSave', function(e) {
    actualEventsList.push('afterSave global');
  });
  Astro.eventManager.on('beforeInsert', function(e) {
    actualEventsList.push('beforeInsert global');
  });
  Astro.eventManager.on('afterInsert', function(e) {
    actualEventsList.push('afterInsert global');
  });
  Astro.eventManager.on('beforeUpdate', function(e) {
    actualEventsList.push('beforeUpdate global');
  });
  Astro.eventManager.on('afterUpdate', function(e) {
    actualEventsList.push('afterUpdate global');
  });
  Astro.eventManager.on('beforeRemove', function(e) {
    actualEventsList.push('beforeRemove global');
  });
  Astro.eventManager.on('afterRemove', function(e) {
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
    'beforeGet 1 (childField)',
    'beforeGet 2 (childField)',
    'beforeGet global (childField)',
    'afterGet 1 (childField)',
    'afterGet 2 (childField)',
    'afterGet global (childField)',
    'beforeGet 1 (_id)',
    'beforeGet 2 (_id)',
    'beforeGet global (_id)',
    'afterGet 1 (_id)',
    'afterGet 2 (_id)',
    'afterGet global (_id)',
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
    'beforeChange 1 (childField)',
    'beforeChange 2 (childField)',
    'beforeChange global (childField)',
    'beforeSet 1 (childField)',
    'beforeSet 2 (childField)',
    'beforeSet global (childField)',
    'afterSet 1 (childField)',
    'afterSet 2 (childField)',
    'afterSet global (childField)',
    'afterChange 1 (childField)',
    'afterChange 2 (childField)',
    'afterChange global (childField)',
    'beforeGet 1 (childField)',
    'beforeGet 2 (childField)',
    'beforeGet global (childField)',
    'afterGet 1 (childField)',
    'afterGet 2 (childField)',
    'afterGet global (childField)',
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
    'Wrong events order on a document update after with a change'
  );
});
