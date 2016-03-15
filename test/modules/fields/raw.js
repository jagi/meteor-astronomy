Tinytest.add('Fields - Modules - Raw', function(test) {
  reset();

  let RawClassNested = Astro.Class.create({
    name: 'RawClassNested',
    fields: {
      string: {
        type: String
      }
    }
  });

  // Define simple class to work with.
  let RawClass = Astro.Class.create({
    name: 'RawClass',
    fields: {
      one: {
        type: RawClassNested
      },
      many: {
        type: [RawClassNested]
      }
    }
  });

  let doc = new RawClass({
    one: new RawClassNested({
      string: 'abc'
    }),
    many: [
      new RawClassNested({
        string: 'abc'
      })
    ]
  });

  test.equal(doc.raw('one'), {
      string: 'abc'
    },
    'Wrong raw value get from the "one" field'
  );
  test.equal(doc.raw('one.string'), 'abc',
    'Wrong raw value get from the "one.tring" field'
  );
  test.equal(doc.raw('many'), [{
      string: 'abc'
    }],
    'Wrong raw value get from the "many" field'
  );
  test.equal(doc.raw('many.0'), {
      string: 'abc'
    },
    'Wrong raw value get from the "many.0" field'
  );
  test.equal(doc.raw('many.0.string'), 'abc',
    'Wrong raw value get from the "many.0.string" field'
  );
});