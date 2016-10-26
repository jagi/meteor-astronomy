Tinytest.add('Modules - Helpers - Definition', function(test) {
  // Reset Astro.
  reset();

  const Helper = Astro.Class.create({
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
