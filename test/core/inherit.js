import { Class, Field } from 'meteor/jagi:astronomy';

Tinytest.add('Core - Inherit', function(test) {
  reset();

  const Parent = Class.create({
    name: 'Parent',
    fields: {
      parentField: {
        type: String
      }
    },
    helpers: {
      parentHelper() {}
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
    helpers: {
      childHelper() {}
    },
    events: {
      afterInit() {}
    }
  });

  // Fields.
  test.instanceOf(Child.getField('parentField'), Field,
    'The child class should inherit parent fields'
  );
  test.instanceOf(Child.getField('childField'), Field,
    'The child class should have its own fields'
  );

  // Helpers.
  test.instanceOf(Child.getHelper('parentHelper'), Function,
    'The child class should inherit parent helpers'
  );
  test.instanceOf(Child.getHelper('childHelper'), Function,
    'The child class should have its own helpers'
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