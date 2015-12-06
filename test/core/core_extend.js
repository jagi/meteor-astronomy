Tinytest.add('Core - Extend', function(test) {
  let Extended = Astro.Class.create({
    name: 'Extended',
    fields: {
      originalField: 'string'
    },
    methods: {
      originalMethod: function() {}
    },
    events: {
      afterInit: function() {}
    }
  });

  Extended.extend({
    fields: {
      extendField: 'string'
    },
    methods: {
      extendMethod: function() {}
    },
    events: {
      afterInit: function() {}
    }
  });

  // Fields.
  test.instanceOf(Extended.getField('originalField'), Astro.Field,
    'Class should contain original fields'
  );
  test.instanceOf(Extended.getField('extendField'), Astro.Field,
    'Class should contain extended fields'
  );

  // Methods.
  test.instanceOf(Extended.getMethod('originalMethod'), Function,
    'Class should contain original methods'
  );
  test.instanceOf(Extended.getMethod('extendMethod'), Function,
    'Class should contain extended methods'
  );

  // Events.
  test.equal(Extended.getEvents('afterInit').length, 2,
    'Class should contain two "afterInit" event handlers'
  );
});
