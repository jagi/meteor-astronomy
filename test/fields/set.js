Tinytest.add('Fields - Set', function(test) {
  reset();

  let SetClassNested = Astro.Class.create({
    name: 'SetClassNested',
    fields: {
      'anything': null
    }
  });

  // Define simple class to work with.
  let SetClass = Astro.Class.create({
    name: 'SetClass',
    nested: {
      'one': {
        count: 'one',
        class: 'SetClassNested'
      },
      'many': {
        count: 'many',
        class: 'SetClassNested'
      }
    }
  });

  let doc = new SetClass();

  doc.set('one', new SetClassNested());
  test.equal(doc.one, new SetClassNested(),
    'Wrong value set in the "one" field'
  );

  doc.set('one.anything', {});
  test.equal(doc.one.anything, {},
    'Wrong value set in the "one.anything" field'
  );

  doc.set('one.anything.string', 'string');
  test.equal(doc.one.anything.string, 'string',
    'Wrong value set in the "one.anything.string" field'
  );

  doc.set('many', []);
  test.equal(doc.many, [],
    'Wrong value set in the "many" field'
  );

  doc.set('many.0', new SetClassNested());
  test.equal(doc.many[0], new SetClassNested(),
    'Wrong value set in the "many.0" field'
  );

  doc.set('many.0.anything', {});
  test.equal(doc.many[0].anything, {},
    'Wrong value set in the "many.0.anything" field'
  );

  doc.set('many.0.anything.string', 'string');
  test.equal(doc.many[0].anything.string, 'string',
    'Wrong value set in the "many.0.anything.string" field'
  );
});
