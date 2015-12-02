Tinytest.add('Core - Extend', function(test) {
  var originalAfterInit = function() {};
  var extendAfterInit = function() {};

  var Extended = Astro.Class({
    name: 'Extended',
    fields: {
      originalField: 'string'
    },
    methods: {
      originalMethod: function() {}
    },
    events: {
      afterInit: originalAfterInit
    },
    behaviors: {
      timestamp: {}
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
      afterInit: extendAfterInit
    },
    behaviors: {
      slug: {}
    }
  });

  var extended = new Extended();

  test.instanceOf(Extended.getField('originalField'), Astro.Field,
    'The class should contain original fields'
  );
  test.instanceOf(Extended.getField('extendField'), Astro.Field,
    'The class should contain extended fields'
  );

  test.instanceOf(extended.originalMethod, Function,
    'The class should contain original methods'
  );
  test.instanceOf(extended.extendMethod, Function,
    'The class should contain extended methods'
  );

  test.instanceOf(Extended.getBehavior('timestamp'), Astro.ClassBehavior,
    'The class should contain original behaviors'
  );
  test.instanceOf(Extended.getBehavior('slug'), Astro.ClassBehavior,
    'The class should contain extended behaviors'
  );
});
