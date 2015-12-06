Tinytest.add('Core - Inherit', function(test) {
  var Parent = Astro.Class.create({
    name: 'Parent',
    fields: {
      parentField: 'string'
    },
    methods: {
      parentMethod: function() {}
    },
    events: {
      afterInit: function() {}
    }
  });

  var Child = Parent.inherit({
    name: 'Child',
    fields: {
      childField: 'string'
    },
    methods: {
      childMethod: function() {}
    },
    events: {
      afterInit: function() {}
    }
  });

  var child = new Child();

  // Fields.
  test.instanceOf(Child.getField('parentField'), Astro.Field,
    'The child class should inherit parent fields'
  );
  test.instanceOf(Child.getField('childField'), Astro.Field,
    'The child class should have its own fields'
  );

  // Methods.
  test.instanceOf(child.parentMethod, Function,
    'The child class should inherit parent methods'
  );
  test.instanceOf(child.childMethod, Function,
    'The child class should have its own methods'
  );

  // Events.
  test.equal(Child.getEvents('afterInit').length, 2,
    'The child class should have two "afterInit" event handlers'
  );

  // Instance check.
  test.instanceOf(child, Parent,
    'An instance of the child class should be also instance of the parent class'
  );
});
