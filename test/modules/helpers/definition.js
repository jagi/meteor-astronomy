import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Helpers - Definition', function(test) {
  // Reset Astronomy.
  reset();

  const Helper = Class.create({
    name: 'Helper',
    helpers: {
      helperA() {
        return 'string123';
      }
    }
  });

  const helper = new Helper();

  test.equal(helper.helperA(), 'string123',
    'The "methodA" helper should return "string123"'
  );
});
