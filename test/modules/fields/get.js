Tinytest.add('Fields - Modules - Get', function(test) {
  reset();

  let GetClassNested = Astro.Class.create({
    name: 'GetClassNested',
    fields: {
      string: {
        type: String
      }
    }
  });

  // Define simple class to work with.
  let GetClass = Astro.Class.create({
    name: 'GetClass',
    fields: {
      one: {
        type: GetClassNested
      },
      many: {
        type: [GetClassNested]
      }
    }
  });

  let doc = new GetClass({
    one: new GetClassNested({
      string: 'abc'
    }),
    many: [
      new GetClassNested({
        string: 'abc'
      })
    ]
  });

  test.equal(doc.get('one'), new GetClassNested({
      string: 'abc'
    }),
    'Wrong value get from the "one" field'
  );
  test.equal(doc.get('one.string'), 'abc',
    'Wrong value get from the "one.string" field'
  );
  test.equal(doc.get('many'), [
      new GetClassNested({
        string: 'abc'
      })
    ],
    'Wrong value get from the "many" field'
  );
  test.equal(doc.get('many.0'), new GetClassNested({
      string: 'abc'
    }),
    'Wrong value get from the "many.0" field'
  );
  test.equal(doc.get('many.0.string'), 'abc',
    'Wrong value get from the "many.0.string" field'
  );
});