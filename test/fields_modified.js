Tinytest.add('Fields - Modified', function(test) {
  var field = new Field();

  var modified = [
    'null', 'string', 'number', 'boolean', 'date', 'nested', 'object', 'array'
  ];
  test.equal(_.keys(field.getModified()), modified,
    'All fields of a newly created document should be modified'
  );

  field.save();
  field.set({
    'string': 'abc',
    'number': 321,
    'boolean': false
  });
  var modified = [
    'string', 'number', 'boolean'
  ];
  test.equal(_.keys(field.getModified()), modified,
    'Only changed fields of a document should be modified'
  );
});
