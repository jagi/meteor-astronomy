Tinytest.add('Fields definition', function(test) {
  var ItemA = Astro.Class({
    name: 'ItemA',
    fields: ['defaultField']
  });
  test.equal(_.size(ItemA.getFields()), 2,
    'The "ItemA" class should have 2 fields'
  );

  ItemA.addField('defaultField2');
  test.equal(_.size(ItemA.getFields()), 3,
    'The "ItemA" class should have 3 fields'
  );

  ItemA.addField('stringField', 'string');
  test.equal(_.size(ItemA.getFields()), 4,
    'The "ItemA" class should have 4 fields'
  );

  ItemA.addField('numberField', {
    type: 'number',
    default: 5
  });
  test.equal(_.size(ItemA.getFields()), 5,
    'The "ItemA" class should have 5 fields'
  );

  ItemA.addFields({
    booleanField: {
      type: 'boolean',
      default: true
    }
  });
  test.equal(_.size(ItemA.getFields()), 6,
    'The "ItemA" class should have 6 fields'
  );
});

Tinytest.add('Default values', function(test) {
  var ItemB = Astro.Class({
    name: 'ItemB',
    fields: {
      stringField: {
        type: 'string',
        default: 'string'
      },
      numberField: {
        type: 'number',
        default: 123
      },
      booleanField: {
        type: 'boolean',
        default: true
      },
      dateField: {
        type: 'date',
        default: new Date(2000, 0, 1)
      }
    }
  });
  var itemB = new ItemB();

  test.equal(itemB.stringField, 'string',
    'The "stringField" field\'s default value should be "string"'
  );
  test.equal(itemB.numberField, 123,
    'The "numberField" field\'s default value should be 123'
  );
  test.isTrue(itemB.booleanField,
    'The "booleanField" field\'s default value should be null'
  );
  test.equal(itemB.dateField, new Date(2000, 0, 1),
    'The "dateField" field\'s default value should be date "2000-01-01"'
  );
});

Tinytest.add('Types casting', function(test) {
  var ItemC = Astro.Class({
    name: 'ItemC',
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
  var itemC = new ItemC();

  itemC.set('stringField', 123);
  test.equal(itemC.stringField, '123',
    'The "stringField" field\'s set value 123 should become "123"'
  );
  itemC.set('numberField', '123');
  test.equal(itemC.numberField, 123,
    'The "numberField" field\'s set value "123" should become 123'
  );
  itemC.set('booleanField', '');
  test.isFalse(itemC.booleanField,
    'The "booleanField" field\'s set value "" should become false'
  );
  itemC.set('booleanField', '123');
  test.isTrue(itemC.booleanField,
    'The "booleanField" field\'s set value "123" should become true'
  );
  itemC.set('booleanField', 0);
  test.isFalse(itemC.booleanField,
    'The "booleanField" field\'s set value 0 should become false'
  );
  itemC.set('booleanField', 1);
  test.isTrue(itemC.booleanField,
    'The "booleanField" field\'s set value 1 should become true'
  );
  itemC.set('dateField', (new Date(2000, 0, 1, 0, 0, 0)).getTime());
  test.equal(itemC.dateField, new Date(2000, 0, 1, 0, 0, 0),
    'The "dateField" field\'s set value "" should become false'
  );
});
