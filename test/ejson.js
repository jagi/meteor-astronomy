Tinytest.add('EJSON module - Meteor methods', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
    fields: {
      stringField: {
        type: 'string'
      },
      numberField: {
        type: 'number'
      },
      booleanField: {
        type: 'boolean'
      },
      objectField: {
        type: 'object'
      },
      arrayField: {
        type: 'array'
      },
      dateField: {
        type: 'date'
      }
    }
  });

  var itemA = new Item({
    stringField: 'string',
    numberField: 123,
    booleanField: true,
    objectField: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    arrayField: [
      1,
      2,
      3
    ],
    dateField: new Date(2000, 0, 1, 0, 0, 0)
  });

  var string = EJSON.stringify(itemA);
  var itemB = EJSON.parse(string);

  test.equal(typeof itemB.stringField, 'string',
    'The "stringField" field\'s value should be a string'
  );
  test.equal(typeof itemB.numberField, 'number',
    'The "numberField" field\'s value should be a number'
  );
  test.equal(typeof itemB.booleanField, 'boolean',
    'The "booleanField" field\'s value should be a boolean'
  );
  test.instanceOf(itemB.objectField, Object,
    'The "objectField" field\'s value should be an object'
  );
  test.instanceOf(itemB.arrayField, Array,
    'The "arrayField" field\'s value should be an array'
  );
  test.instanceOf(itemB.dateField, Date,
    'The "dateField" field\'s value should be a date'
  );

  test.equal(itemA.stringField, itemB.stringField,
    'The "stringField" field\'s value should not change'
  );
  test.equal(itemA.numberField, itemB.numberField,
    'The "numberField" field\'s value should not change'
  );
  test.equal(itemA.booleanField, itemB.booleanField,
    'The "booleanField" field\'s value should not change'
  );
  test.equal(itemA.objectField, itemB.objectField,
    'The "objectField" field\'s value should not change'
  );
  test.equal(itemA.arrayField, itemB.arrayField,
    'The "arrayField" field\'s value should not change'
  );
  test.equal(itemA.dateField, itemB.dateField,
    'The "dateField" field\'s value should not change'
  );
});
