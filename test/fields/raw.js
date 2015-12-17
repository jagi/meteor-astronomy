Tinytest.add('Fields - Raw', function(test) {
  reset();

  let RawClassNested = Astro.Class.create({
    name: 'RawClassNested',
    fields: {
      'anything': null
    }
  });

  // Define simple class to work with.
  let RawClass = Astro.Class.create({
    name: 'RawClass',
    nested: {
      'one': {
        count: 'one',
        class: 'RawClassNested'
      },
      'many': {
        count: 'many',
        class: 'RawClassNested'
      }
    }
  });

  let doc = new RawClass({
    one: new RawClassNested({
      anything: {
        string: 'string'
      }
    }),
    many: [
      new RawClassNested({
        anything: {
          string: 'string'
        }
      })
    ]
  });

  test.equal(doc.raw('one'), {
    anything: {
      string: 'string'
    }
  },
    'Wrong raw value get from the "one" field'
  );
  test.equal(doc.raw('one.anything'), {
    string: 'string'
  },
    'Wrong raw value get from the "one.anything" field'
  );
  test.equal(doc.raw('one.anything.string'), 'string',
    'Wrong raw value get from the "one.anything.string" field'
  );
  test.equal(doc.raw('many'), [
    {
      anything: {
        string: 'string'
      }
    }
  ],
    'Wrong raw value get from the "many" field'
  );
  test.equal(doc.raw('many.0'), {
    anything: {
      string: 'string'
    }
  },
    'Wrong raw value get from the "many.0" field'
  );
  test.equal(doc.raw('many.0.anything'), {
    string: 'string'
  },
    'Wrong raw value get from the "many.0.anything" field'
  );
  test.equal(doc.raw('many.0.anything.string'), 'string',
    'Wrong raw value get from the "many.0.anything.string" field'
  );
});
