import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Core - Inherit', function(test) {
  reset();

  const Parent = Class.create({
    name: 'Parent',
    fields: {
      parentField: {
        type: String
      }
    },
    methods: {
      parentMethod() {}
    },
    events: {
      afterInit() {}
    }
  });

  const Child = Parent.inherit({
    name: 'Child',
    fields: {
      childField: {
        type: String
      }
    },
    methods: {
      childMethod() {}
    },
    events: {
      afterInit() {}
    }
  });

  // Fields.
  test.instanceOf(Child.getField('parentField'), Astro.Field,
    'The child class should inherit parent fields'
  );
  test.instanceOf(Child.getField('childField'), Astro.Field,
    'The child class should have its own fields'
  );

  // Methods.
  test.instanceOf(Child.getMethod('parentMethod'), Function,
    'The child class should inherit parent methods'
  );
  test.instanceOf(Child.getMethod('childMethod'), Function,
    'The child class should have its own methods'
  );

  // Events.
  test.equal(Child.getEvents('afterInit').length, 2,
    'The child class should have two "afterInit" event handlers'
  );

  // Instance check.
  const child = new Child();
  test.instanceOf(child, Parent,
    'An instance of the child class should be also instance of the parent class'
  );
});