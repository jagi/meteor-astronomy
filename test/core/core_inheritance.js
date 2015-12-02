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

  test.instanceOf(ChildInheritance.getField('parentField'), Astro.Field,
    'The child class should inherit parent fields'
  );
  test.instanceOf(
    ChildInheritance.getBehavior('timestamp'), Astro.ClassBehavior,
    'The child class should inherit parent behaviors'
  );
  test.instanceOf(childInheritance.parentMethod, Function,
    'The child class should inherit parent methods'
  );

  test.instanceOf(ChildInheritance.getField('childField'), Astro.Field,
    'The child class should have its own fields'
  );
  test.instanceOf(ChildInheritance.getBehavior('slug'), Astro.ClassBehavior,
    'The child class should have its own behaviors'
  );
  test.instanceOf(childInheritance.childMethod, Function,
    'The child class should have its own methods'
  );

  test.instanceOf(childInheritance, ParentInheritance,
    'An instance of a child class should be also instance of a parent class'
  );
});
