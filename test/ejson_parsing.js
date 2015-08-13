Tinytest.add('EJSON - Parsing', function(test) {
  var ejsonA = new EJSONClass({
    string: 'string',
    number: 123,
    boolean: true,
    object: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    array: [
      1,
      2,
      3
    ],
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
  test.instanceOf(ejsonB.object, Object,
    'The "object" field\'s value should be an object'
  );
  test.instanceOf(ejsonB.array, Array,
    'The "array" field\'s value should be an array'
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
