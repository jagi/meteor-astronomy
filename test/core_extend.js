Tinytest.add('Core - Extend', function(test) {
  var parentAfterInit = function() {};
  var childAfterInit = function() {};

  ParentExtend = Astro.Class({
    name: 'ParentExtend',
    fields: {
      parentField: 'string'
    },
    methods: {
      parentMethod: function() {}
    },
    events: {
      afterInit: parentAfterInit
    },
    behaviors: {
      timestamp: {}
    }
  });

  ChildExtend = ParentExtend.extend({
    name: 'ChildExtend',
    fields: {
      childField: 'string'
    },
    methods: {
      childMethod: function() {}
    },
    events: {
      afterInit: childAfterInit
    },
    behaviors: {
      slug: {}
    }
  });

  var childExtend = new ChildExtend();

  test.isNotNull(ChildExtend.getField('parentField'),
    'The child class should inherit parent fields'
  );
  test.isNotNull(ChildExtend.getBehavior('timestamp'),
    'The child class should inherit parent behaviors'
  );
  test.isNotNull(childExtend.parentMethod,
    'The child class should inherit parent methods'
  );

  test.isNotNull(ChildExtend.getField('childField'),
    'The child class should have its own fields'
  );
  test.isNotNull(ChildExtend.getBehavior('slug'),
    'The child class should have its own behaviors'
  );
  test.isNotNull(childExtend.childMethod,
    'The child class should have its own methods'
  );
});
