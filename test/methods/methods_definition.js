Tinytest.add('Methods - Definition', function(test) {
  var method = new Method({
    string: 'string',
    number: 123
  });

  test.equal(method.methodA(), 'string123',
    'The "methodA" method should return "string123"'
  );
});
