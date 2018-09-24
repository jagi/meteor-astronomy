import { Class, Field } from 'meteor/jagi:astronomy';

Tinytest.add('Core - Extend', function(test) {
  reset();

  const Extended = Class.create({
    name: 'Extended',
    fields: {
      originalField: {
        type: String
      }
    },
    helpers: {
      originalHelper() {}
    },
    events: {
      afterInit() {}
    }
  });

  Extended.extend({
    fields: {
      extendField: {
        type: String
      }
    },
    helpers: {
      extendHelper() {}
    },
    events: {
      afterInit() {}
    }
  });

  // Fields.
  test.instanceOf(Extended.getField('originalField'), Field,
    'Class should contain original fields'
  );
  test.instanceOf(Extended.getField('extendField'), Field,
    'Class should contain extended fields'
  );

  // Helpers.
  test.instanceOf(Extended.getHelper('originalHelper'), Function,
    'Class should contain original methods'
  );
  test.instanceOf(Extended.getHelper('extendHelper'), Function,
    'Class should contain extended methods'
  );

  // Events.
  test.equal(Extended.getEvents('afterInit').length, 2,
    'Class should contain two "afterInit" event handlers'
  );
});