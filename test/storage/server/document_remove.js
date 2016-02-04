Tinytest.add('Storage - Document remove', function(test) {
  let id = '6tMS79Kx6WhqTEwaC';
  let storage = Storage.findOne(id);

  storage.remove();
  test.equal(Storages.find(id).count(), 0,
    'The document has not been removed properly'
  );
});
