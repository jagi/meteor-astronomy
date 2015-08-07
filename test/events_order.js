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
      beforeset: function(e) {
        events.push('beforeset 1 on parent');
      },
      afterset: function() {
        events.push('afterset 1 on parent');
      },
      beforeget: function(e) {
        events.push('beforeget 1 on parent');
      },
      afterget: function() {
        events.push('afterget 1 on parent');
      },
      beforesave: function() {
        events.push('beforesave 1 on parent');
      },
      aftersave: function() {
        events.push('aftersave 1 on parent');
      },
      beforeinsert: function() {
        events.push('beforeinsert 1 on parent');
      },
      afterinsert: function() {
        events.push('afterinsert 1 on parent');
      },
      beforeupdate: function() {
        events.push('beforeupdate 1 on parent');
      },
      afterupdate: function() {
        events.push('afterupdate 1 on parent');
      }
    }
  });

  ParentItem.addEvents({
    beforeset: function() {
      events.push('beforeset 2 on parent');
    },
    afterset: function() {
      events.push('afterset 2 on parent');
    },
    beforeget: function() {
      events.push('beforeget 2 on parent');
    },
    afterget: function() {
      events.push('afterget 2 on parent');
    },
    beforesave: function(e) {
      events.push('beforesave 2 on parent');
    },
    aftersave: function() {
      events.push('aftersave 2 on parent');
    },
    beforeinsert: function() {
      events.push('beforeinsert 2 on parent');
    },
    afterinsert: function() {
      events.push('afterinsert 2 on parent');
    },
    beforeupdate: function() {
      events.push('beforeupdate 2 on parent');
    },
    afterupdate: function() {
      events.push('afterupdate 2 on parent');
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
      beforeset: function() {
        events.push('beforeset 1 on child');
      },
      afterset: function() {
        events.push('afterset 1 on child');
      },
      beforeget: function() {
        events.push('beforeget 1 on child');
      },
      afterget: function() {
        events.push('afterget 1 on child');
      },
      beforesave: function() {
        events.push('beforesave 1 on child');
      },
      aftersave: function() {
        events.push('aftersave 1 on child');
      },
      beforeinsert: function() {
        events.push('beforeinsert 1 on child');
      },
      afterinsert: function() {
        events.push('afterinsert 1 on child');
      },
      beforeupdate: function() {
        events.push('beforeupdate 1 on child');
      },
      afterupdate: function() {
        events.push('afterupdate 1 on child');
      }
    }
  });

  ChildItem.addEvents({
    beforeset: function() {
      events.push('beforeset 2 on child');
    },
    afterset: function() {
      events.push('afterset 2 on child');
    },
    beforeget: function() {
      events.push('beforeget 2 on child');
    },
    afterget: function() {
      events.push('afterget 2 on child');
    },
    beforesave: function() {
      events.push('beforesave 2 on child');
    },
    aftersave: function() {
      events.push('aftersave 2 on child');
    },
    beforeinsert: function() {
      events.push('beforeinsert 2 on child');
    },
    afterinsert: function() {
      events.push('afterinsert 2 on child');
    },
    beforeupdate: function() {
      events.push('beforeupdate 2 on child');
    },
    afterupdate: function() {
      events.push('afterupdate 2 on child');
    }
  });

  Astro.eventManager.on('beforeset', function() {
    events.push('beforeset global');
  });
  Astro.eventManager.on('afterset', function() {
    events.push('afterset global');
  });
  Astro.eventManager.on('beforeget', function() {
    events.push('beforeget global');
  });
  Astro.eventManager.on('afterget', function() {
    events.push('afterget global');
  });
  Astro.eventManager.on('beforesave', function() {
    events.push('beforesave global');
  });
  Astro.eventManager.on('aftersave', function() {
    events.push('aftersave global');
  });
  Astro.eventManager.on('beforeinsert', function() {
    events.push('beforeinsert global');
  });
  Astro.eventManager.on('afterinsert', function() {
    events.push('afterinsert global');
  });
  Astro.eventManager.on('beforeupdate', function() {
    events.push('beforeupdate global');
  });
  Astro.eventManager.on('afterupdate', function() {
    events.push('afterupdate global');
  });
  Astro.eventManager.on('beforeremove', function() {
    events.push('beforeremove global');
  });
  Astro.eventManager.on('afterremove', function() {
    events.push('afterremove global');
  });

  // 1.
  events = [];
  expectedOrder = [
    'beforesave 1 on parent',
    'beforesave 2 on parent',
    'beforesave global',
    'beforeinsert 1 on parent',
    'beforeinsert 2 on parent',
    'beforeinsert global',
    'afterinsert 1 on parent',
    'afterinsert 2 on parent',
    'afterinsert global',
    'aftersave 1 on parent',
    'aftersave 2 on parent',
    'aftersave global'
  ];
  var parentItem = new ParentItem();
  parentItem.save();
  test.equal(events, expectedOrder,
    '1. Wrong events order on a parent document insert'
  );

  // 2.
  events = [];
  expectedOrder = [
    'beforesave 1 on parent',
    'beforesave 2 on parent',
    'beforesave global',
    'beforeupdate 1 on parent',
    'beforeupdate 2 on parent',
    'beforeupdate global'
  ];
  parentItem.save();
  test.equal(events, expectedOrder,
    '2. Wrong events order on a parent document update without a change'
  );

  // 3.
  events = [];
  expectedOrder = [
    'beforeset 1 on parent',
    'beforeset 2 on parent',
    'beforeset global',
    'afterset 1 on parent',
    'afterset 2 on parent',
    'afterset global',
    'beforeget 1 on parent',
    'beforeget 2 on parent',
    'beforeget global',
    'afterget 1 on parent',
    'afterget 2 on parent',
    'afterget global',
    'beforesave 1 on parent',
    'beforesave 2 on parent',
    'beforesave global',
    'beforeupdate 1 on parent',
    'beforeupdate 2 on parent',
    'beforeupdate global',
    'afterupdate 1 on parent',
    'afterupdate 2 on parent',
    'afterupdate global',
    'aftersave 1 on parent',
    'aftersave 2 on parent',
    'aftersave global'
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
    'beforesave 1 on child',
    'beforesave 2 on child',
    'beforesave 1 on parent',
    'beforesave 2 on parent',
    'beforesave global',
    'beforeinsert 1 on child',
    'beforeinsert 2 on child',
    'beforeinsert 1 on parent',
    'beforeinsert 2 on parent',
    'beforeinsert global',
    'afterinsert 1 on child',
    'afterinsert 2 on child',
    'afterinsert 1 on parent',
    'afterinsert 2 on parent',
    'afterinsert global',
    'aftersave 1 on child',
    'aftersave 2 on child',
    'aftersave 1 on parent',
    'aftersave 2 on parent',
    'aftersave global'
  ];
  var childItem = new ChildItem();
  childItem.save();
  test.equal(events, expectedOrder,
    '4. Wrong events order on a child document insert'
  );

  // 5.
  events = [];
  expectedOrder = [
    'beforesave 1 on child',
    'beforesave 2 on child',
    'beforesave 1 on parent',
    'beforesave 2 on parent',
    'beforesave global',
    'beforeupdate 1 on child',
    'beforeupdate 2 on child',
    'beforeupdate 1 on parent',
    'beforeupdate 2 on parent',
    'beforeupdate global'
  ];
  childItem.save();
  test.equal(events, expectedOrder,
    '5. Wrong events order on a child document update without a change'
  );

  // 6.
  events = [];
  expectedOrder = [
    'beforeset 1 on child',
    'beforeset 2 on child',
    'beforeset 1 on parent',
    'beforeset 2 on parent',
    'beforeset global',
    'afterset 1 on child',
    'afterset 2 on child',
    'afterset 1 on parent',
    'afterset 2 on parent',
    'afterset global',
    'beforeget 1 on child',
    'beforeget 2 on child',
    'beforeget 1 on parent',
    'beforeget 2 on parent',
    'beforeget global',
    'afterget 1 on child',
    'afterget 2 on child',
    'afterget 1 on parent',
    'afterget 2 on parent',
    'afterget global',
    'beforesave 1 on child',
    'beforesave 2 on child',
    'beforesave 1 on parent',
    'beforesave 2 on parent',
    'beforesave global',
    'beforeupdate 1 on child',
    'beforeupdate 2 on child',
    'beforeupdate 1 on parent',
    'beforeupdate 2 on parent',
    'beforeupdate global',
    'afterupdate 1 on child',
    'afterupdate 2 on child',
    'afterupdate 1 on parent',
    'afterupdate 2 on parent',
    'afterupdate global',
    'aftersave 1 on child',
    'aftersave 2 on child',
    'aftersave 1 on parent',
    'aftersave 2 on parent',
    'aftersave global'
  ];
  childItem.set('childField', 'update');
  childItem.get('childField');
  childItem.save();
  test.equal(events, expectedOrder,
    '6. Wrong events order on a child document update after a change'
  );
});
