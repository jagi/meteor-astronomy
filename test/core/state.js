Tinytest.add('Core - State', function(test) {
  reset();

  let States = new Mongo.Collection(null);

  let State = Astro.Class.create({
    name: 'State',
    collection: States
  });

  let core = new State();
  test.isTrue(core._isNew,
    'A newly created document should have the "_isNew" flag set to true'
  );

  core.save();
  test.isFalse(core._isNew,
    'The saved document should have the "_isNew" flag set to false'
  );

  core = States.findOne();
  test.isFalse(core._isNew,
    'A document fetched from the collection should have the "_isNew" flag ' +
    'set to false'
  );
});
