Tinytest.add('Fields - Getters', function(test) {
  var item = new SimpleItem({
    string: 'string',
    number: 123,
    boolean: true,
    date: new Date(2000, 0, 1, 0, 0, 0, 0),
    array: [1, 2, 3],
    object: {
      a: 'a',
      b: 'b',
      c: 'c'
    }
  });

  test.equal(item.get('string'), 'string',
    'Calling "item.get(\'string\')" should return "string"'
  );

  test.equal(item.get('number'), 123,
    'Calling "item.get(\'number\')" should return 123'
  );

  test.equal(item.get('boolean'), true,
    'Calling "item.get(\'boolean\')" should return true'
  );

  test.equal(item.get('date'), new Date(2000, 0, 1, 0, 0, 0, 0),
    'Calling "item.get(\'date\')" should return Date(2000, 0, 1, 0, 0, 0, 0)'
  );

  test.equal(item.get('array'), [1, 2, 3],
    'Calling "item.get(\'array\')" should return [1, 2, 3]'
  );

  test.equal(item.get('object'), {
    a: 'a',
    b: 'b',
    c: 'c'
  },
    'Calling "item.get(\'object\')" should return {a: "a", b: "b", c: "c"}'
  );

  test.equal(item.get('object.a'), 'a',
    'The value of the "object.a" field should be equal "a"'
  );
});
