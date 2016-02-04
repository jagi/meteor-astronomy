Tinytest.add('Storage - Class remove', function(test) {
  let id = '6tMS79Kx6WhqTEwaC';
  Storage.remove(id);

  test.equal(Storages.find(id).count(), 0,
    'Document has not been removed properly'
  );
});
