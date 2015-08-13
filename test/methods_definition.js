Tinytest.add('Methods - Definition', function(test) {
  test.equal(_.size(Method.getMethods()), 2,
    'The "Method" class should have 2 methods'
  );

  var method = new Method({
    string: 'string',
    number: 123
  });

  test.equal(method.methodA(), 'string123',
    'The "methodA" method should return "string123"'
  );
});
