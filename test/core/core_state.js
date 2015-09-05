Tinytest.add('Core - State', function(test) {
  var core = new Core();

  test.isTrue(core._isNew,
    'A newly created document should have the "_isNew" flag set to true'
  );

  core.save();
  test.isFalse(core._isNew,
    'A save document should have the "_isNew" flag set to false'
  );

  core = Cores.findOne();
  test.isFalse(core._isNew,
    'A document fetched from the collection should have the "_isNew" flag ' +
    'set to false'
  );
});
