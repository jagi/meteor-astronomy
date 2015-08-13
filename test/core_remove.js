Tinytest.add('Core - Remove', function(test) {
  var item = Cores.findOne();
  item.remove();

  test.equal(Cores.find().count(), 0,
    'The document has not been removed properly'
  );
});
