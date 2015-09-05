Tinytest.add('Fields - Default', function(test) {
  var field = new Field();

  test.isNull(field.get('null'),
    'The default value of the "null" field should be null'
  );
  test.equal(field.get('string'), 'string',
    'The default value of the "string" field should be "string"'
  );
  test.equal(field.get('number'), 123,
    'The default value of the "number" field should be 123'
  );
  test.equal(field.get('boolean'), true,
    'The default value of the "boolean" field should be null'
  );
  test.equal(field.get('date'), new Date(2000, 0, 1),
    'The default value of the "date" field should be Date(2000, 0, 1)'
  );
  test.equal(field.get('object'), {},
    'The default value of the "object" field should be {}'
  );
  test.equal(field.get('array'), [],
    'The default value of the "array" field should be []'
  );
  test.instanceOf(field.get('nested'), Nested,
    'The default value of the "nested" field should be instance of the ' +
    'Nested class'
  );
});
