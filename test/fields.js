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

Tinytest.add('Fields module - Default and cast values', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
    fields: {
      'string': {
        type: 'string',
        default: 'string'
      },
      'number': {
        type: 'number',
        default: 123
      },
      'boolean': {
        type: 'boolean',
        default: true
      },
      'date': {
        type: 'date',
        default: new Date(2000, 0, 1)
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

  test.equal(item.string, 'string',
    'The "string" field\'s default value should be "string"'
  );
  test.equal(item.number, 123,
    'The "number" field\'s default value should be 123'
  );
  test.equal(item.boolean, true,
    'The "boolean" field\'s default value should be null'
  );
  test.equal(item.date, new Date(2000, 0, 1),
    'The "date" field\'s default value should be date "2000-01-01"'
  );
  test.equal(item.object, {},
    'The "object" field\'s default value should be null'
  );
  test.equal(item.array, [],
    'The "array" field\'s default value should be null'
  );

  item.set('string', 123);
  item.set('number', '123');
  item.set('boolean', 1);
  item.set('date', 946681200000);
  item.set('object', 123);
  item.set('array', 123);
  test.equal(item.string, '123',
    'The "string" field\'s value should be casted to string'
  );
  test.equal(item.number, 123,
    'The "number" field\'s value should be casted to number'
  );
  test.equal(item.boolean, true,
    'The "boolean" field\'s value should be casted to boolean'
  );
  test.equal(item.date, new Date(2000, 0, 1),
    'The "date" field\'s value should be casted to date'
  );
  test.instanceOf(item.object, Number,
    'The "object" field\'s value should be casted to object'
  );
  test.equal(item.array, [123],
    'The "array" field\'s value should be casted to array'
  );

  item.set('object', {});
  item.set('object.property', undefined);
  item.set('array', []);
  item.set('array.0', undefined);
  test.equal(item.object.property, 'property',
    'The "object.property" field\'s default value should be "property"'
  );
  test.equal(item.array[0], {},
    'The "array.0" field\'s default value should be {}'
  );

  item.set('object.property', 123);
  test.equal(item.object.property, '123',
    'The "object.property" field\'s value should be casted to string'
  );

  item.set('array.0.property', undefined);
  test.equal(item.array[0].property, 'property',
    'The "array.0.property" field\'s default value should be "property"'
  );

  item.set('array.0.property', 123);
  test.equal(item.array[0].property, '123',
    'The "array.0.property" field\'s value should be casted to string'
  );
});
