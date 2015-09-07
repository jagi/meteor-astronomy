Tinytest.add('Types module - Type casting', function(test) {
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
      dateField: {
        type: 'date'
      }
    }
  });
  var item = new Item();

  item.set('stringField', 123);
  test.equal(item.stringField, '123',
    'The "stringField" field\'s set value 123 should become "123"'
  );

  // String to number
  item.set('numberField', '123');
  test.equal(item.numberField, 123,
    'The "numberField" field\'s set value "123" should become 123'
  );
  // invalid to NaN
  item.set('numberField', 'invalid');
  test.equal(item.numberField, NaN,
    'The "numberField" field\'s set value "invalid" should become NaN'
  );

  item.set('booleanField', '');
  test.isFalse(item.booleanField,
    'The "booleanField" field\'s set value "" should become false'
  );
  item.set('booleanField', '123');
  test.isTrue(item.booleanField,
    'The "booleanField" field\'s set value "123" should become true'
  );
  item.set('booleanField', 0);
  test.isFalse(item.booleanField,
    'The "booleanField" field\'s set value 0 should become false'
  );
  item.set('booleanField', 1);
  test.isTrue(item.booleanField,
    'The "booleanField" field\'s set value 1 should become true'
  );

  // integer gets cast to date
  item.set('dateField', (new Date(2000, 0, 1, 0, 0, 0)).getTime());
  test.equal(item.dateField, new Date(2000, 0, 1, 0, 0, 0),
    'The "dateField" field\'s set value of integer should become date object'
  );
  // string is cast to date
  item.set('dateField', 'January 1, 2000');
  test.equal(item.dateField, new Date(2000, 0, 1, 0, 0, 0),
    'The "dateField" field\'s set value of valid date string should become date object'
  );
  // invalid string is cast to invalid date
  item.set('dateField', 'invalid');
  test.instanceOf(item.dateField, Date,
    'The "dateField" field\'s set value of is invalid date object'
  );
});
