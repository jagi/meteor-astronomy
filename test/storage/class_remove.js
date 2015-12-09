Tinytest.add('Storage - Class remove', function(test) {
  let id = Storages.findOne()._id;

  Storage.remove(id);

  test.equal(Storages.find().count(), 0,
    'Document has not been removed properly'
  );
});
