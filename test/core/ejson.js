Tinytest.add('Core - EJSON', function(test) {
  reset();

  let NestedEJSON = Astro.Class.create({
    name: 'NestedEJSON',
    fields: {
      'string': 'string',
      'number': 'number'
    }
  });

  let ClassEJSON = Astro.Class.create({
    name: 'ClassEJSON',
    nested: {
      'one': {
        count: 'one',
        class: 'NestedEJSON'
      },
      'many': {
        count: 'many',
        class: 'NestedEJSON'
      }
    },
    fields: {
      'anything': null,
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'date': 'date'
    }
  });

  let doc = new ClassEJSON({
    one: {
      string: 'abc',
      number: 123
    },
    many: [{
      string: 'abc',
      number: 123
    }],
    anything: {
      string: 'abc',
      number: 123
    },
    string: 'abc',
    number: 123,
    boolean: true,
    date: new Date(2000, 0, 1, 0, 0, 0)
  });

  test.isTrue(EJSON.equals(doc, EJSON.clone(doc)),
    'Original and cloned document do not match'
  );
});
