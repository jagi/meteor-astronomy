Tinytest.add('Events - Order', function(test) {
  Astro.classes = [];

  var events;
  var expectedOrder;

  var ParentItem = Astro.Class({
    name: 'ParentItem',
    collection: Items,
    fields: {
      parentField: {
        type: 'String',
        default: null
      }
    },
    events: {
      beforeSet: function(e) {
        events.push('beforeSet 1 on parent');
      },
      afterSet: function() {
        events.push('afterSet 1 on parent');
      },
      beforeGet: function(e) {
        events.push('beforeGet 1 on parent');
      },
      afterGet: function() {
        events.push('afterGet 1 on parent');
      },
      beforeSave: function() {
        events.push('beforeSave 1 on parent');
      },
      afterSave: function() {
        events.push('afterSave 1 on parent');
      },
      beforeInsert: function() {
        events.push('beforeInsert 1 on parent');
      },
      afterInsert: function() {
        events.push('afterInsert 1 on parent');
      },
      beforeUpdate: function() {
        events.push('beforeUpdate 1 on parent');
      },
      afterUpdate: function() {
        events.push('afterUpdate 1 on parent');
      }
    }
  });

  ParentItem.addEvents({
    beforeSet: function() {
      events.push('beforeSet 2 on parent');
    },
    afterSet: function() {
      events.push('afterSet 2 on parent');
    },
    beforeGet: function() {
      events.push('beforeGet 2 on parent');
    },
    afterGet: function() {
      events.push('afterGet 2 on parent');
    },
    beforeSave: function(e) {
      events.push('beforeSave 2 on parent');
    },
    afterSave: function() {
      events.push('afterSave 2 on parent');
    },
    beforeInsert: function() {
      events.push('beforeInsert 2 on parent');
    },
    afterInsert: function() {
      events.push('afterInsert 2 on parent');
    },
    beforeUpdate: function() {
      events.push('beforeUpdate 2 on parent');
    },
    afterUpdate: function() {
      events.push('afterUpdate 2 on parent');
    }
  });

  var ChildItem = ParentItem.extend({
    name: 'ChildItem',
    fields: {
      childField: {
        type: 'String',
        default: null
      }
    },
    events: {
      beforeSet: function() {
        events.push('beforeSet 1 on child');
      },
      afterSet: function() {
        events.push('afterSet 1 on child');
      },
      beforeGet: function() {
        events.push('beforeGet 1 on child');
      },
      afterGet: function() {
        events.push('afterGet 1 on child');
      },
      beforeSave: function() {
        events.push('beforeSave 1 on child');
      },
      afterSave: function() {
        events.push('afterSave 1 on child');
      },
      beforeInsert: function() {
        events.push('beforeInsert 1 on child');
      },
      afterInsert: function() {
        events.push('afterInsert 1 on child');
      },
      beforeUpdate: function() {
        events.push('beforeUpdate 1 on child');
      },
      afterUpdate: function() {
        events.push('afterUpdate 1 on child');
      }
    }
  });

  ChildItem.addEvents({
    beforeSet: function() {
      events.push('beforeSet 2 on child');
    },
    afterSet: function() {
      events.push('afterSet 2 on child');
    },
    beforeGet: function() {
      events.push('beforeGet 2 on child');
    },
    afterGet: function() {
      events.push('afterGet 2 on child');
    },
    beforeSave: function() {
      events.push('beforeSave 2 on child');
    },
    afterSave: function() {
      events.push('afterSave 2 on child');
    },
    beforeInsert: function() {
      events.push('beforeInsert 2 on child');
    },
    afterInsert: function() {
      events.push('afterInsert 2 on child');
    },
    beforeUpdate: function() {
      events.push('beforeUpdate 2 on child');
    },
    afterUpdate: function() {
      events.push('afterUpdate 2 on child');
    }
  });

  Astro.eventManager.on('beforeSet', function() {
    events.push('beforeSet global');
  });
  Astro.eventManager.on('afterSet', function() {
    events.push('afterSet global');
  });
  Astro.eventManager.on('beforeGet', function() {
    events.push('beforeGet global');
  });
  Astro.eventManager.on('afterGet', function() {
    events.push('afterGet global');
  });
  Astro.eventManager.on('beforeSave', function() {
    events.push('beforeSave global');
  });
  Astro.eventManager.on('afterSave', function() {
    events.push('afterSave global');
  });
  Astro.eventManager.on('beforeInsert', function() {
    events.push('beforeInsert global');
  });
  Astro.eventManager.on('afterInsert', function() {
    events.push('afterInsert global');
  });
  Astro.eventManager.on('beforeUpdate', function() {
    events.push('beforeUpdate global');
  });
  Astro.eventManager.on('afterUpdate', function() {
    events.push('afterUpdate global');
  });
  Astro.eventManager.on('beforeRemove', function() {
    events.push('beforeRemove global');
  });
  Astro.eventManager.on('afterRemove', function() {
    events.push('afterRemove global');
  });

  // 1.
  events = [];
  expectedOrder = [
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeInsert 1 on parent',
    'beforeInsert 2 on parent',
    'beforeInsert global',
    'afterInsert 1 on parent',
    'afterInsert 2 on parent',
    'afterInsert global',
    'afterSave 1 on parent',
    'afterSave 2 on parent',
    'afterSave global'
  ];
  var parentItem = new ParentItem();
  parentItem.save();
  test.equal(events, expectedOrder,
    '1. Wrong events order on a parent document insert'
  );

  // 2.
  events = [];
  expectedOrder = [
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeUpdate 1 on parent',
    'beforeUpdate 2 on parent',
    'beforeUpdate global'
  ];
  parentItem.save();
  test.equal(events, expectedOrder,
    '2. Wrong events order on a parent document update without a change'
  );

  // 3.
  events = [];
  expectedOrder = [
    'beforeSet 1 on parent',
    'beforeSet 2 on parent',
    'beforeSet global',
    'afterSet 1 on parent',
    'afterSet 2 on parent',
    'afterSet global',
    'beforeGet 1 on parent',
    'beforeGet 2 on parent',
    'beforeGet global',
    'afterGet 1 on parent',
    'afterGet 2 on parent',
    'afterGet global',
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeUpdate 1 on parent',
    'beforeUpdate 2 on parent',
    'beforeUpdate global',
    'afterUpdate 1 on parent',
    'afterUpdate 2 on parent',
    'afterUpdate global',
    'afterSave 1 on parent',
    'afterSave 2 on parent',
    'afterSave global'
  ];
  parentItem.set('parentField', 'update');
  parentItem.get('parentField');
  parentItem.save();
  test.equal(events, expectedOrder,
    '3. Wrong events order on a parent document update after a change'
  );

  // 4.
  events = [];
  expectedOrder = [
    'beforeSave 1 on child',
    'beforeSave 2 on child',
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeInsert 1 on child',
    'beforeInsert 2 on child',
    'beforeInsert 1 on parent',
    'beforeInsert 2 on parent',
    'beforeInsert global',
    'afterInsert 1 on child',
    'afterInsert 2 on child',
    'afterInsert 1 on parent',
    'afterInsert 2 on parent',
    'afterInsert global',
    'afterSave 1 on child',
    'afterSave 2 on child',
    'afterSave 1 on parent',
    'afterSave 2 on parent',
    'afterSave global'
  ];
  var childItem = new ChildItem();
  childItem.save();
  test.equal(events, expectedOrder,
    '4. Wrong events order on a child document insert'
  );

  // 5.
  events = [];
  expectedOrder = [
    'beforeSave 1 on child',
    'beforeSave 2 on child',
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeUpdate 1 on child',
    'beforeUpdate 2 on child',
    'beforeUpdate 1 on parent',
    'beforeUpdate 2 on parent',
    'beforeUpdate global'
  ];
  childItem.save();
  test.equal(events, expectedOrder,
    '5. Wrong events order on a child document update without a change'
  );

  // 6.
  events = [];
  expectedOrder = [
    'beforeSet 1 on child',
    'beforeSet 2 on child',
    'beforeSet 1 on parent',
    'beforeSet 2 on parent',
    'beforeSet global',
    'afterSet 1 on child',
    'afterSet 2 on child',
    'afterSet 1 on parent',
    'afterSet 2 on parent',
    'afterSet global',
    'beforeGet 1 on child',
    'beforeGet 2 on child',
    'beforeGet 1 on parent',
    'beforeGet 2 on parent',
    'beforeGet global',
    'afterGet 1 on child',
    'afterGet 2 on child',
    'afterGet 1 on parent',
    'afterGet 2 on parent',
    'afterGet global',
    'beforeSave 1 on child',
    'beforeSave 2 on child',
    'beforeSave 1 on parent',
    'beforeSave 2 on parent',
    'beforeSave global',
    'beforeUpdate 1 on child',
    'beforeUpdate 2 on child',
    'beforeUpdate 1 on parent',
    'beforeUpdate 2 on parent',
    'beforeUpdate global',
    'afterUpdate 1 on child',
    'afterUpdate 2 on child',
    'afterUpdate 1 on parent',
    'afterUpdate 2 on parent',
    'afterUpdate global',
    'afterSave 1 on child',
    'afterSave 2 on child',
    'afterSave 1 on parent',
    'afterSave 2 on parent',
    'afterSave global'
  ];
  childItem.set('childField', 'update');
  childItem.get('childField');
  childItem.save();
  test.equal(events, expectedOrder,
    '6. Wrong events order on a child document update after a change'
  );
});
