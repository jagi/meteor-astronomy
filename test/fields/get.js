Tinytest.add('Fields - Get', function(test) {
  reset();

  let GetClassNested = Astro.Class.create({
    name: 'GetClassNested',
    fields: {
      'anything': null
    }
  });

  // Define simple class to work with.
  let GetClass = Astro.Class.create({
    name: 'GetClass',
    nested: {
      'one': {
        count: 'one',
        class: 'GetClassNested'
      },
      'many': {
        count: 'many',
        class: 'GetClassNested'
      }
    }
  });

  let doc = new GetClass({
    one: new GetClassNested({
      anything: {
        string: 'string'
      }
    }),
    many: [
      new GetClassNested({
        anything: {
          string: 'string'
        }
      })
    ]
  });

  test.equal(doc.get('one'), new GetClassNested({
    anything: {
      string: 'string'
    }
  }),
    'Wrong value get from the "one" field'
  );
  test.equal(doc.get('one.anything'), {
    string: 'string'
  },
    'Wrong value get from the "one.anything" field'
  );
  test.equal(doc.get('one.anything.string'), 'string',
    'Wrong value get from the "one.anything.string" field'
  );
  test.equal(doc.get('many'), [
    new GetClassNested({
      anything: {
        string: 'string'
      }
    })
  ],
    'Wrong value get from the "many" field'
  );
  test.equal(doc.get('many.0'), new GetClassNested({
    anything: {
      string: 'string'
    }
  }),
    'Wrong value get from the "many.0" field'
  );
  test.equal(doc.get('many.0.anything'), {
    string: 'string'
  },
    'Wrong value get from the "many.0.anything" field'
  );
  test.equal(doc.get('many.0.anything.string'), 'string',
    'Wrong value get from the "many.0.anything.string" field'
  );
});
