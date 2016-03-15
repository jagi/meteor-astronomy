Tinytest.add('Fields - Modules - Set', function(test) {
  reset();

  let SetClassNested = Astro.Class.create({
    name: 'SetClassNested',
    fields: {
      string: {
        type: String
      }
    }
  });

  // Define simple class to work with.
  let SetClass = Astro.Class.create({
    name: 'SetClass',
    fields: {
      one: {
        type: SetClassNested
      },
      many: {
        type: [SetClassNested]
      }
    }
  });

  let doc = new SetClass();

  doc.set('one', new SetClassNested());
  test.equal(doc.one, new SetClassNested(),
    'Wrong value set in the "one" field'
  );

  doc.set('one.string', 'abc');
  test.equal(doc.one.string, 'abc',
    'Wrong value set in the "one.string" field'
  );

  doc.set('many', []);
  test.equal(doc.many, [],
    'Wrong value set in the "many" field'
  );

  doc.set('many.0', new SetClassNested());
  test.equal(doc.many[0], new SetClassNested(),
    'Wrong value set in the "many.0" field'
  );

  doc.set('many.0.string', 'abc');
  test.equal(doc.many[0].string, 'abc',
    'Wrong value set in the "many.0.string" field'
  );
});