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
        actualEventsList.push('beforeInit');
      },
      afterInit: function(e) {
        actualEventsList.push('afterInit');
      },
      beforeChange: function(e) {
        actualEventsList.push('beforeChange (' + e.data.fieldName + ')');
      },
      beforeSet: function(e) {
        actualEventsList.push('beforeSet (' + e.data.fieldName + ')');
      },
      afterSet: function(e) {
        actualEventsList.push('afterSet (' + e.data.fieldName + ')');
      },
      afterChange: function(e) {
        actualEventsList.push('afterChange (' + e.data.fieldName + ')');
      },
      beforeGet: function(e) {
        actualEventsList.push('beforeGet (' + e.data.fieldName + ')');
      },
      afterGet: function(e) {
        actualEventsList.push('afterGet (' + e.data.fieldName + ')');
      },
      beforeSave: function(e) {
        actualEventsList.push('beforeSave');
      },
      afterSave: function(e) {
        actualEventsList.push('afterSave');
      },
      beforeInsert: function(e) {
        actualEventsList.push('beforeInsert');
      },
      afterInsert: function(e) {
        actualEventsList.push('afterInsert');
      },
      beforeUpdate: function(e) {
        actualEventsList.push('beforeUpdate');
      },
      afterUpdate: function(e) {
        actualEventsList.push('afterUpdate');
      }
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
    'beforeInit',
    'beforeInit global',
    'afterInit',
    'afterInit global',
    'beforeSave',
    'beforeSave global',
    'beforeInsert',
    'beforeInsert global',
    'afterInsert',
    'afterInsert global',
    'afterSave',
    'afterSave global'
  ];
  var event = new EventsOrder();
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a document insert'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeSave',
    'beforeSave global',
    'beforeUpdate',
    'beforeUpdate global'
  ];
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a document update without a change'
  );

  actualEventsList = [];
  expectedEventsList = [
    'beforeChange (childField)',
    'beforeChange global (childField)',
    'beforeSet (childField)',
    'beforeSet global (childField)',
    'afterSet (childField)',
    'afterSet global (childField)',
    'afterChange (childField)',
    'afterChange global (childField)',
    'beforeGet (childField)',
    'beforeGet global (childField)',
    'afterGet (childField)',
    'afterGet global (childField)',
    'beforeSave',
    'beforeSave global',
    'beforeUpdate',
    'beforeUpdate global',
    'afterUpdate',
    'afterUpdate global',
    'afterSave',
    'afterSave global'
  ];
  event.set('childField', 'update');
  event.get('childField');
  event.save();
  test.equal(actualEventsList, expectedEventsList,
    'Wrong events order on a document update after with a change'
  );
});
