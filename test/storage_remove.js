Tinytest.add('Storage - Remove', function(test) {
  var item = Storages.findOne();
  item.remove();

  test.equal(Storages.find().count(), 0,
    'The document has not been removed properly'
  );
});
