Tinytest.add('Fields - Setters', function(test) {
  var field = new Field();

  field.set('string', 'string');
  test.equal(field.string, 'string',
    'The value of the "string" field should be equal "string"'
  );

  field.set('number', 123);
  test.equal(field.number, 123,
    'The value of the "number" field should be equal 123'
  );

  field.set('boolean', true);
  test.equal(field.boolean, true,
    'The value of the "boolean" field should be equal true'
  );

  field.set('date', new Date(2000, 0, 1, 0, 0, 0, 0));
  test.equal(field.date, new Date(2000, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2000, 0, 1, 0, 0, 0, 0)'
  );

  field.set('array', [1, 2]);
  test.equal(field.array, [1, 2],
    'The value of the "array" field should be equal [1, 2]'
  );

  field.set('object', {
    a: 'a',
    b: 'b'
  });
  test.equal(field.object, {
    a: 'a',
    b: 'b'
  },
    'The value of the "object" field should be equal {a: "a", b: "b"}'
  );

  field = new Field();
  field.set({
    string: 'STRING',
    number: 321,
    boolean: false,
    date: new Date(2001, 0, 1, 0, 0, 0, 0),
    array: [1, 2, 3],
    object: {
      a: 'a',
      b: 'b',
      c: 'c'
    }
  });

  test.equal(field.string, 'STRING',
    'The value of the "string" field should be equal "STRING"'
  );
  test.equal(field.number, 321,
    'The value of the "number" field should be equal 321'
  );
  test.equal(field.boolean, false,
    'The value of the "boolean" field should be equal false'
  );
  test.equal(field.date, new Date(2001, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2001, 0, 1, 0, 0, 0, 0)'
  );
  test.equal(field.array, [1, 2, 3],
    'The value of the "array" field should be equal [1, 2, 3]'
  );
  test.equal(field.object, {
    a: 'a',
    b: 'b',
    c: 'c'
  },
    'The value of the "object" field should be equal {a: "a", b: "b", c: "c"}'
  );

  field = new Field({
    string: 'str',
    number: 111,
    boolean: true,
    date: new Date(2002, 0, 1, 0, 0, 0, 0),
    array: [1],
    object: {
      a: 'a'
    }
  });

  test.equal(field.string, 'str',
    'The value of the "string" field should be equal "str"'
  );
  test.equal(field.number, 111,
    'The value of the "number" field should be equal 111'
  );
  test.equal(field.boolean, true,
    'The value of the "boolean" field should be equal true'
  );
  test.equal(field.date, new Date(2002, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2002, 0, 1, 0, 0, 0, 0)'
  );
  test.equal(field.array, [1],
    'The value of the "array" field should be equal [1]'
  );
  test.equal(field.object, {
    a: 'a'
  },
    'The value of the "object" field should be equal {a: "a"}'
  );

  field.set('object.a', 1);
  test.equal(field.object.a, 1,
    'The value of the "object.a" field should be equal 1'
  );

  field.set('nested.string', 'string');
  test.equal(field.nested.string, 'string',
    'The value of the "nested.string" field should be equal "string"'
  );
});
