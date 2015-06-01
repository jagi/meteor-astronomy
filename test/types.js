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
  item.set('numberField', '123');
  test.equal(item.numberField, 123,
    'The "numberField" field\'s set value "123" should become 123'
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
  item.set('dateField', (new Date(2000, 0, 1, 0, 0, 0)).getTime());
  test.equal(item.dateField, new Date(2000, 0, 1, 0, 0, 0),
    'The "dateField" field\'s set value "" should become false'
  );
});
