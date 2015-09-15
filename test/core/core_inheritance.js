Tinytest.add('Core - Inheritance', function(test) {
  var parentAfterInit = function() {};
  var childAfterInit = function() {};

  var ParentInheritance = Astro.Class({
    name: 'ParentInheritance',
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

  var ChildInheritance = ParentInheritance.inherit({
    name: 'ChildInheritance',
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

  var childInheritance = new ChildInheritance();

  test.isNotNull(ChildInheritance.getField('parentField'),
    'The child class should inherit parent fields'
  );
  test.isNotNull(ChildInheritance.getBehavior('timestamp'),
    'The child class should inherit parent behaviors'
  );
  test.isNotNull(childInheritance.parentMethod,
    'The child class should inherit parent methods'
  );

  test.isNotNull(ChildInheritance.getField('childField'),
    'The child class should have its own fields'
  );
  test.isNotNull(ChildInheritance.getBehavior('slug'),
    'The child class should have its own behaviors'
  );
  test.isNotNull(childInheritance.childMethod,
    'The child class should have its own methods'
  );

  test.instanceOf(childInheritance, ParentInheritance,
    'An instance of a child class should be also instance of a parent class'
  );
});
