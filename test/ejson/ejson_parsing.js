Tinytest.add('EJSON - Parsing', function(test) {
  // Reset Astronomy.
  reset();

  var NestedEJSON = Astro.Class({
    name: 'NestedEJSON',
    fields: {
      'string': {
        type: 'string'
      },
      'number': {
        type: 'number'
      }
    }
  });

  var EJSONClass = Astro.Class({
    name: 'EJSONClass',
    fields: {
      'object': {
        type: 'object',
        nested: 'NestedEJSON'
      },
      'array': {
        type: 'array',
        nested: 'NestedEJSON'
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

  var ejsonA = new EJSONClass({
    string: 'string',
    number: 123,
    boolean: true,
    object: {
      string: 'string',
      number: 123
    },
    array: [{
      string: 'string',
      number: 123
    }],
    date: new Date(2000, 0, 1, 0, 0, 0)
  });

  var string = EJSON.stringify(ejsonA);
  var ejsonB = EJSON.parse(string);

  test.equal(typeof ejsonB.string, 'string',
    'The "string" field\'s value should be a string'
  );
  test.equal(typeof ejsonB.number, 'number',
    'The "number" field\'s value should be a number'
  );
  test.equal(typeof ejsonB.boolean, 'boolean',
    'The "boolean" field\'s value should be a boolean'
  );
  test.instanceOf(ejsonB.object, NestedEJSON,
    'The "object" field\'s value should be an instance of the NestedEJSON class'
  );
  test.instanceOf(ejsonB.array, Array,
    'The "array" field\'s value should be an array'
  );
  test.instanceOf(ejsonB.array[0], NestedEJSON,
    'The "array" field\'s first value should be an instance of the ' +
    'NestedEJSON class'
  );
  test.instanceOf(ejsonB.date, Date,
    'The "date" field\'s value should be a date'
  );

  test.equal(ejsonA.string, ejsonB.string,
    'The "string" field\'s value should not change'
  );
  test.equal(ejsonA.number, ejsonB.number,
    'The "number" field\'s value should not change'
  );
  test.equal(ejsonA.boolean, ejsonB.boolean,
    'The "boolean" field\'s value should not change'
  );
  test.equal(ejsonA.object, ejsonB.object,
    'The "object" field\'s value should not change'
  );
  test.equal(ejsonA.array, ejsonB.array,
    'The "array" field\'s value should not change'
  );
  test.equal(ejsonA.date, ejsonB.date,
    'The "date" field\'s value should not change'
  );
});
