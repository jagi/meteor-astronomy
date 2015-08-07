Tinytest.add('Core - Remove', function(test) {
  var item = Items.findOne();
  item.remove();

  test.equal(Items.find().count(), 0,
    'The document has not been removed properly'
  );
});
