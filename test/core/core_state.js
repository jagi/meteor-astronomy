Tinytest.add('Core - State', function(test) {
  var States = new Mongo.Collection(null);
  removeAll(States);

  var NestedState = Astro.Class({
    name: 'NestedState',
    fields: {
      'object': {
        type: 'object'
      },
      'array': {
        type: 'array'
      },
      'string': {
        type: 'string'
      },
      'number': {
        type: 'number'
      },
      'boolean': {
        type: 'boolean'
      },
      'date': {
        type: 'date'
      }
    }
  });

  var State = Astro.Class({
    name: 'State',
    collection: States,
    fields: {
      'nested': {
        type: 'object',
        nested: 'NestedState'
      },
      'object': {
        type: 'object'
      },
      'array': {
        type: 'array'
      },
      'string': {
        type: 'string'
      },
      'number': {
        type: 'number'
      },
      'boolean': {
        type: 'boolean'
      },
      'date': {
        type: 'date'
      }
    }
  });

  var core = new State();

  test.isTrue(core._isNew,
    'A newly created document should have the "_isNew" flag set to true'
  );

  core.save();
  test.isFalse(core._isNew,
    'A save document should have the "_isNew" flag set to false'
  );

  core = States.findOne();
  test.isFalse(core._isNew,
    'A document fetched from the collection should have the "_isNew" flag ' +
    'set to false'
  );
});
