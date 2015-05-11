Tinytest.add('ParentEventOrder order', function(test) {
  var events;
  var expectedOrder;

  var EventOrders = new Mongo.Collection(null);
  var ParentEventOrder = Astro.Class({
    name: 'ParentEventOrder',
    collection: EventOrders,
    fields: {
      parentField: {
        type: 'string',
        default: null
      }
    },
    events: {
      beforeset: function() {
        events.push('1. beforeset on parent');
      },
      afterset: function() {
        events.push('1. afterset on parent');
      },
      beforeget: function() {
        events.push('1. beforeget on parent');
      },
      afterget: function() {
        events.push('1. afterget on parent');
      },
      beforesave: function() {
        events.push('1. beforesave on parent');
      },
      aftersave: function() {
        events.push('1. aftersave on parent');
      },
      beforeinsert: function() {
        events.push('1. beforeinsert on parent');
      },
      afterinsert: function() {
        events.push('1. afterinsert on parent');
      },
      beforeupdate: function() {
        events.push('1. beforeupdate on parent');
      },
      afterupdate: function() {
        events.push('1. afterupdate on parent');
      }
    }
  });

  ParentEventOrder.schema.addEvents({
    beforeset: function() {
      events.push('2. beforeset on parent');
    },
    afterset: function() {
      events.push('2. afterset on parent');
    },
    beforeget: function() {
      events.push('2. beforeget on parent');
    },
    afterget: function() {
      events.push('2. afterget on parent');
    },
    beforesave: function() {
      events.push('2. beforesave on parent');
    },
    aftersave: function() {
      events.push('2. aftersave on parent');
    },
    beforeinsert: function() {
      events.push('2. beforeinsert on parent');
    },
    afterinsert: function() {
      events.push('2. afterinsert on parent');
    },
    beforeupdate: function() {
      events.push('2. beforeupdate on parent');
    },
    afterupdate: function() {
      events.push('2. afterupdate on parent');
    }
  });

  var ChildEventOrder = ParentEventOrder.extend({
    name: 'ChildEventOrder',
    fields: {
      childField: {
        type: 'string',
        default: null
      }
    },
    events: {
      beforeset: function() {
        events.push('1. beforeset on child');
      },
      afterset: function() {
        events.push('1. afterset on child');
      },
      beforeget: function() {
        events.push('1. beforeget on child');
      },
      afterget: function() {
        events.push('1. afterget on child');
      },
      beforesave: function() {
        events.push('1. beforesave on child');
      },
      aftersave: function() {
        events.push('1. aftersave on child');
      },
      beforeinsert: function() {
        events.push('1. beforeinsert on child');
      },
      afterinsert: function() {
        events.push('1. afterinsert on child');
      },
      beforeupdate: function() {
        events.push('1. beforeupdate on child');
      },
      afterupdate: function() {
        events.push('1. afterupdate on child');
      }
    }
  });

  ChildEventOrder.schema.addEvents({
    beforeset: function() {
      events.push('2. beforeset on child');
    },
    afterset: function() {
      events.push('2. afterset on child');
    },
    beforeget: function() {
      events.push('2. beforeget on child');
    },
    afterget: function() {
      events.push('2. afterget on child');
    },
    beforesave: function() {
      events.push('2. beforesave on child');
    },
    aftersave: function() {
      events.push('2. aftersave on child');
    },
    beforeinsert: function() {
      events.push('2. beforeinsert on child');
    },
    afterinsert: function() {
      events.push('2. afterinsert on child');
    },
    beforeupdate: function() {
      events.push('2. beforeupdate on child');
    },
    afterupdate: function() {
      events.push('2. afterupdate on child');
    }
  });

  Astro.on('beforeset', function() {
    events.push('global beforeset');
  });
  Astro.on('afterset', function() {
    events.push('global afterset');
  });
  Astro.on('beforeget', function() {
    events.push('global beforeget');
  });
  Astro.on('afterget', function() {
    events.push('global afterget');
  });
  Astro.on('beforesave', function() {
    events.push('global beforesave');
  });
  Astro.on('aftersave', function() {
    events.push('global aftersave');
  });
  Astro.on('beforeinsert', function() {
    events.push('global beforeinsert');
  });
  Astro.on('afterinsert', function() {
    events.push('global afterinsert');
  });
  Astro.on('beforeupdate', function() {
    events.push('global beforeupdate');
  });
  Astro.on('afterupdate', function() {
    events.push('global afterupdate');
  });
  Astro.on('beforeremove', function() {
    events.push('global beforeremove');
  });
  Astro.on('afterremove', function() {
    events.push('global afterremove');
  });

  // 1. parent test.
  events = [];
  expectedOrder = [
    '1. beforeget on parent',
    '2. beforeget on parent',
    'global beforeget',
    '1. afterget on parent',
    '2. afterget on parent',
    'global afterget',
    '1. beforeget on parent',
    '2. beforeget on parent',
    'global beforeget',
    '1. afterget on parent',
    '2. afterget on parent',
    'global afterget',
    '1. beforesave on parent',
    '2. beforesave on parent',
    'global beforesave',
    '1. beforeinsert on parent',
    '2. beforeinsert on parent',
    'global beforeinsert',
    '1. afterinsert on parent',
    '2. afterinsert on parent',
    'global afterinsert',
    '1. aftersave on parent',
    '2. aftersave on parent',
    'global aftersave'
  ];
  var parentEventOrder = new ParentEventOrder();
  parentEventOrder.save();
  test.equal(events, expectedOrder,
    '1. Wrong events order on a parent document insert'
  );

  // 2. parent test.
  events = [];
  expectedOrder = [];
  parentEventOrder.save();
  test.equal(events, expectedOrder,
    '2. Wrong events order on a parent document update without a change'
  );

  // 3. parent test.
  events = [];
  expectedOrder = [
    '1. beforeset on parent',
    '2. beforeset on parent',
    'global beforeset',
    '1. afterset on parent',
    '2. afterset on parent',
    'global afterset',
    '1. beforesave on parent',
    '2. beforesave on parent',
    'global beforesave',
    '1. beforeupdate on parent',
    '2. beforeupdate on parent',
    'global beforeupdate',
    '1. afterupdate on parent',
    '2. afterupdate on parent',
    'global afterupdate',
    '1. aftersave on parent',
    '2. aftersave on parent',
    'global aftersave'
  ];
  parentEventOrder.parentField = 'update';
  parentEventOrder.save();
  test.equal(events, expectedOrder,
    '3. Wrong events order on a parent document update after a change'
  );

  // 4. child test.
  events = [];
  expectedOrder = [
    '1. beforeget on child',
    '2. beforeget on child',
    '1. beforeget on parent',
    '2. beforeget on parent',
    'global beforeget',
    '1. afterget on child',
    '2. afterget on child',
    '1. afterget on parent',
    '2. afterget on parent',
    'global afterget',
    '1. beforeget on child',
    '2. beforeget on child',
    '1. beforeget on parent',
    '2. beforeget on parent',
    'global beforeget',
    '1. afterget on child',
    '2. afterget on child',
    '1. afterget on parent',
    '2. afterget on parent',
    'global afterget',
    '1. beforeget on child',
    '2. beforeget on child',
    '1. beforeget on parent',
    '2. beforeget on parent',
    'global beforeget',
    '1. afterget on child',
    '2. afterget on child',
    '1. afterget on parent',
    '2. afterget on parent',
    'global afterget',
    '1. beforeget on child',
    '2. beforeget on child',
    '1. beforeget on parent',
    '2. beforeget on parent',
    'global beforeget',
    '1. afterget on child',
    '2. afterget on child',
    '1. afterget on parent',
    '2. afterget on parent',
    'global afterget',
    '1. beforeget on child',
    '2. beforeget on child',
    '1. beforeget on parent',
    '2. beforeget on parent',
    'global beforeget',
    '1. afterget on child',
    '2. afterget on child',
    '1. afterget on parent',
    '2. afterget on parent',
    'global afterget',
    '1. beforesave on child',
    '2. beforesave on child',
    '1. beforesave on parent',
    '2. beforesave on parent',
    'global beforesave',
    '1. beforeinsert on child',
    '2. beforeinsert on child',
    '1. beforeinsert on parent',
    '2. beforeinsert on parent',
    'global beforeinsert',
    '1. afterinsert on child',
    '2. afterinsert on child',
    '1. afterinsert on parent',
    '2. afterinsert on parent',
    'global afterinsert',
    '1. aftersave on child',
    '2. aftersave on child',
    '1. aftersave on parent',
    '2. aftersave on parent',
    'global aftersave'
  ];
  var childEventOrder = new ChildEventOrder();
  childEventOrder.save();
  test.equal(events, expectedOrder,
    '4. Wrong events order on a child document insert'
  );

  // 5. child test.
  events = [];
  expectedOrder = [];
  childEventOrder.save();
  test.equal(events, expectedOrder,
    '5. Wrong events order on a child document update without a change'
  );

  // 6. child test.
  events = [];
  expectedOrder = [
    '1. beforeset on child',
    '2. beforeset on child',
    '1. beforeset on parent',
    '2. beforeset on parent',
    'global beforeset',
    '1. afterset on child',
    '2. afterset on child',
    '1. afterset on parent',
    '2. afterset on parent',
    'global afterset',
    '1. beforesave on child',
    '2. beforesave on child',
    '1. beforesave on parent',
    '2. beforesave on parent',
    'global beforesave',
    '1. beforeupdate on child',
    '2. beforeupdate on child',
    '1. beforeupdate on parent',
    '2. beforeupdate on parent',
    'global beforeupdate',
    '1. afterupdate on child',
    '2. afterupdate on child',
    '1. afterupdate on parent',
    '2. afterupdate on parent',
    'global afterupdate',
    '1. aftersave on child',
    '2. aftersave on child',
    '1. aftersave on parent',
    '2. aftersave on parent',
    'global aftersave'
  ];
  childEventOrder.childField = 'update';
  childEventOrder.save();
  test.equal(events, expectedOrder,
    '6. Wrong events order on a child document update after a change'
  );
});
