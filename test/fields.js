Tinytest.add('Fields module - Fields definition', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
    fields: ['defaultField']
  });
  test.equal(_.size(Item.getFields()), 2,
    'The "Item" class should have 2 fields'
  );

  Item.addField('defaultField2');
  test.equal(_.size(Item.getFields()), 3,
    'The "Item" class should have 3 fields'
  );

  Item.addField('stringField', 'string');
  test.equal(_.size(Item.getFields()), 4,
    'The "Item" class should have 4 fields'
  );

  Item.addField('numberField', {
    type: 'number',
    default: 5
  });
  test.equal(_.size(Item.getFields()), 5,
    'The "Item" class should have 5 fields'
  );

  Item.addFields({
    booleanField: {
      type: 'boolean',
      default: true
    }
  });
  test.equal(_.size(Item.getFields()), 6,
    'The "Item" class should have 6 fields'
  );
});

Tinytest.add('Fields module - Default values', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
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
  var item = new Item();

  test.equal(item.stringField, 'string',
    'The "stringField" field\'s default value should be "string"'
  );
  test.equal(item.numberField, 123,
    'The "numberField" field\'s default value should be 123'
  );
  test.isTrue(item.booleanField,
    'The "booleanField" field\'s default value should be null'
  );
  test.equal(item.dateField, new Date(2000, 0, 1),
    'The "dateField" field\'s default value should be date "2000-01-01"'
  );
});

Tinytest.add('Fields module - Nested fields', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
    fields: {
      'string': {
        type: 'string',
        default: 'string'
      },
      'object': {
        type: 'object',
        default: {}
      },
      'object.property': {
        type: 'string',
        default: 'property'
      },
      'array': {
        type: 'array',
        default: []
      },
      'array.$': {
        type: 'object',
        default: {}
      },
      'array.$.property': {
        type: 'string',
        default: 'property'
      }
    }
  });

  var item = new Item();
});
