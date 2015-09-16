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

  test.isNotNull(Extended.getField('originalField'),
    'The class should contain original fields'
  );
  test.isNotNull(Extended.getField('extendField'),
    'The class should contain extended fields'
  );

  test.isNotNull(extended.originalMethod,
    'The class should contain original methods'
  );
  test.isNotNull(extended.extendMethod,
    'The class should contain extended methods'
  );

  test.isNotNull(Extended.getBehavior('timestamp'),
    'The class should contain original behaviors'
  );
  test.isNotNull(Extended.getBehavior('slug'),
    'The class should contain extended behaviors'
  );
});
