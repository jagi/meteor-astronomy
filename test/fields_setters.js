Tinytest.add('Fields - Setters', function(test) {
  var item = new SimpleItem();

  item.set('string', 'string');
  test.equal(item.string, 'string',
    'The value of the "string" field should be equal "string"'
  );

  item.set('number', 123);
  test.equal(item.number, 123,
    'The value of the "number" field should be equal 123'
  );

  item.set('boolean', true);
  test.equal(item.boolean, true,
    'The value of the "boolean" field should be equal true'
  );

  item.set('date', new Date(2000, 0, 1, 0, 0, 0, 0));
  test.equal(item.date, new Date(2000, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2000, 0, 1, 0, 0, 0, 0)'
  );

  item.set('array', [1, 2]);
  test.equal(item.array, [1, 2],
    'The value of the "array" field should be equal [1, 2]'
  );

  item.set('object', {
    a: 'a',
    b: 'b'
  });
  test.equal(item.object, {
    a: 'a',
    b: 'b'
  },
    'The value of the "object" field should be equal {a: "a", b: "b"}'
  );

  item = new SimpleItem();
  item.set({
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

  test.equal(item.string, 'STRING',
    'The value of the "string" field should be equal "STRING"'
  );
  test.equal(item.number, 321,
    'The value of the "number" field should be equal 321'
  );
  test.equal(item.boolean, false,
    'The value of the "boolean" field should be equal false'
  );
  test.equal(item.date, new Date(2001, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2001, 0, 1, 0, 0, 0, 0)'
  );
  test.equal(item.array, [1, 2, 3],
    'The value of the "array" field should be equal [1, 2, 3]'
  );
  test.equal(item.object, {
    a: 'a',
    b: 'b',
    c: 'c'
  },
    'The value of the "object" field should be equal {a: "a", b: "b", c: "c"}'
  );

  item = new SimpleItem({
    string: 'str',
    number: 111,
    boolean: true,
    date: new Date(2002, 0, 1, 0, 0, 0, 0),
    array: [1],
    object: {
      a: 'a'
    }
  });

  test.equal(item.string, 'str',
    'The value of the "string" field should be equal "str"'
  );
  test.equal(item.number, 111,
    'The value of the "number" field should be equal 111'
  );
  test.equal(item.boolean, true,
    'The value of the "boolean" field should be equal true'
  );
  test.equal(item.date, new Date(2002, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2002, 0, 1, 0, 0, 0, 0)'
  );
  test.equal(item.array, [1],
    'The value of the "array" field should be equal [1]'
  );
  test.equal(item.object, {
    a: 'a'
  },
    'The value of the "object" field should be equal {a: "a"}'
  );

  item.set('object.a', 1);
  test.equal(item.object.a, 1,
    'The value of the "object.a" field should be equal 1'
  );
});
