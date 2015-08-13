Tinytest.add('Events - Init', function(test) {
  Astro.classes = [];

  Orders = new Mongo.Collection(null);

  actualEventsList;
  expectedEventsList;

  ParentEvent = Astro.Class({
    name: 'ParentEvent',
    collection: Orders,
    fields: {
      parentField: {
        type: 'String',
        default: null
      }
    },
    events: {
      beforeSet: function(e) {
        actualEventsList.push('beforeSet 1 on parent');
      },
      afterSet: function() {
        actualEventsList.push('afterSet 1 on parent');
      },
      beforeGet: function(e) {
        actualEventsList.push('beforeGet 1 on parent');
      },
      afterGet: function() {
        actualEventsList.push('afterGet 1 on parent');
      },
      beforeSave: function() {
        actualEventsList.push('beforeSave 1 on parent');
      },
      afterSave: function() {
        actualEventsList.push('afterSave 1 on parent');
      },
      beforeInsert: function() {
        actualEventsList.push('beforeInsert 1 on parent');
      },
      afterInsert: function() {
        actualEventsList.push('afterInsert 1 on parent');
      },
      beforeUpdate: function() {
        actualEventsList.push('beforeUpdate 1 on parent');
      },
      afterUpdate: function() {
        actualEventsList.push('afterUpdate 1 on parent');
      }
    }
  });

  ParentEvent.addEvents({
    beforeSet: function() {
      actualEventsList.push('beforeSet 2 on parent');
    },
    afterSet: function() {
      actualEventsList.push('afterSet 2 on parent');
    },
    beforeGet: function() {
      actualEventsList.push('beforeGet 2 on parent');
    },
    afterGet: function() {
      actualEventsList.push('afterGet 2 on parent');
    },
    beforeSave: function(e) {
      actualEventsList.push('beforeSave 2 on parent');
    },
    afterSave: function() {
      actualEventsList.push('afterSave 2 on parent');
    },
    beforeInsert: function() {
      actualEventsList.push('beforeInsert 2 on parent');
    },
    afterInsert: function() {
      actualEventsList.push('afterInsert 2 on parent');
    },
    beforeUpdate: function() {
      actualEventsList.push('beforeUpdate 2 on parent');
    },
    afterUpdate: function() {
      actualEventsList.push('afterUpdate 2 on parent');
    }
  });

  ChildEvent = ParentEvent.extend({
    name: 'ChildEvent',
    fields: {
      childField: {
        type: 'String',
        default: null
      }
    },
    events: {
      beforeSet: function() {
        actualEventsList.push('beforeSet 1 on child');
      },
      afterSet: function() {
        actualEventsList.push('afterSet 1 on child');
      },
      beforeGet: function() {
        actualEventsList.push('beforeGet 1 on child');
      },
      afterGet: function() {
        actualEventsList.push('afterGet 1 on child');
      },
      beforeSave: function() {
        actualEventsList.push('beforeSave 1 on child');
      },
      afterSave: function() {
        actualEventsList.push('afterSave 1 on child');
      },
      beforeInsert: function() {
        actualEventsList.push('beforeInsert 1 on child');
      },
      afterInsert: function() {
        actualEventsList.push('afterInsert 1 on child');
      },
      beforeUpdate: function() {
        actualEventsList.push('beforeUpdate 1 on child');
      },
      afterUpdate: function() {
        actualEventsList.push('afterUpdate 1 on child');
      }
    }
  });

  ChildEvent.addEvents({
    beforeSet: function() {
      actualEventsList.push('beforeSet 2 on child');
    },
    afterSet: function() {
      actualEventsList.push('afterSet 2 on child');
    },
    beforeGet: function() {
      actualEventsList.push('beforeGet 2 on child');
    },
    afterGet: function() {
      actualEventsList.push('afterGet 2 on child');
    },
    beforeSave: function() {
      actualEventsList.push('beforeSave 2 on child');
    },
    afterSave: function() {
      actualEventsList.push('afterSave 2 on child');
    },
    beforeInsert: function() {
      actualEventsList.push('beforeInsert 2 on child');
    },
    afterInsert: function() {
      actualEventsList.push('afterInsert 2 on child');
    },
    beforeUpdate: function() {
      actualEventsList.push('beforeUpdate 2 on child');
    },
    afterUpdate: function() {
      actualEventsList.push('afterUpdate 2 on child');
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
