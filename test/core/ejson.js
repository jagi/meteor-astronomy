Tinytest.add('Core - EJSON', function(test) {
  reset();

  let NestedEJSON = Astro.Class.create({
    name: 'NestedEJSON',
    fields: {
      string: {
        type: String
      },
      number: {
        type: Number
      }
    }
  });

  let ClassEJSON = Astro.Class.create({
    name: 'ClassEJSON',
    fields: {
      one: {
        type: NestedEJSON
      },
      many: {
        type: [NestedEJSON]
      },
      string: {
        type: String
      },
      number: {
        type: Number
      },
      boolean: {
        type: Boolean
      },
      date: {
        type: Date
      }
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
    string: 'abc',
    number: 123,
    boolean: true,
    date: new Date(2000, 0, 1, 0, 0, 0)
  });

  test.isTrue(EJSON.equals(doc, EJSON.clone(doc)),
    'Original and cloned document do not match'
  );
});