import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Core - State', function(test) {
  reset();

  const States = new Mongo.Collection(null);

  const State = Class.create({
    name: 'State',
    collection: States
  });

  let core = new State();
  test.isTrue(State.isNew(core),
    'Newly created document should have the "_isNew" flag set to true'
  );

  core.save();
  test.isFalse(State.isNew(core),
    'Saved document should have the "_isNew" flag set to false'
  );

  core = States.findOne();
  test.isFalse(State.isNew(core),
    'Aocument fetched from the collection should have the "_isNew" flag ' +
    'set to false'
  );
});
