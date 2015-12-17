Tinytest.add('Fields - Casting', function(test) {
  reset();

  let CastNested = Astro.Class.create({
    name: 'CastNested',
    fields: {}
  });

  let Cast = Astro.Class.create({
    name: 'Cast',
    nested: {
      'one': {
        count: 'one',
        class: 'CastNested',
        default: function() {
          return {}
        }
      },
      'many': {
        count: 'many',
        class: 'CastNested',
        default: function() {
          return [{}];
        }
      },
    }
  });

  let cast = new Cast();

  test.equal(cast.one, new CastNested(),
    'Single nested value should be casted'
  );
  test.equal(cast.many, [new CastNested()],
    'Multiple nested values should be casted'
  );
});
