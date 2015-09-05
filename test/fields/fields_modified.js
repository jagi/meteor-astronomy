Tinytest.add('Fields - Modified', function(test) {
  var field = new Field();

  test.equal(_.keys(field.getModified()), [],
    'A new document should not have modified fields'
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
