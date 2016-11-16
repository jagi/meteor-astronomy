Tinytest.add('Core - State', function(test) {
  reset();

  const States = new Mongo.Collection(null);

  const State = Astro.Class.create({
    name: 'State',
    collection: States
  });

  let core = new State();
  test.isTrue(core._isNew,
    'Newly created document should have the "_isNew" flag set to true'
  );

  core.save();
  test.isFalse(core._isNew,
    'Saved document should have the "_isNew" flag set to false'
  );

  core = States.findOne();
  test.isFalse(core._isNew,
    'Aocument fetched from the collection should have the "_isNew" flag ' +
    'set to false'
  );
});
