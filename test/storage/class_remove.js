Tinytest.add('Storage - Class remove', function(test) {
  let id = 'ekfAFb8w5umxaeAPs';

  Storage.remove(id);

  test.equal(Storages.find(id).count(), 0,
    'Document has not been removed properly'
  );
});
