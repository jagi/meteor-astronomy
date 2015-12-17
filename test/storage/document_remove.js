Tinytest.add('Storage - Document remove', function(test) {
  let id = 'ekfAFb8w5umxaeAPs';
  let storage = Storage.findOne();

  // Remove a document.
  storage.remove();

  test.equal(Storages.find(id).count(), 0,
    'The document has not been removed properly'
  );
});
