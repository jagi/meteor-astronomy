Tinytest.add('Fields - Definition', function(test) {
  Astro.classes = [];

  var ItemA = Astro.Class({
    name: 'ItemA',
    fields: ['noType1']
  });
  test.equal(_.size(ItemA.getFields()), 1,
    'The "ItemA" class should have 1 field'
  );

  ItemA.addField('noType2');
  test.equal(_.size(ItemA.getFields()), 2,
    'The "ItemA" class should have 2 fields'
  );

  ItemA.addField('string', 'String');
  test.equal(_.size(ItemA.getFields()), 3,
    'The "ItemA" class should have 3 fields'
  );

  ItemA.addField('number', {
    type: 'Number'
  });
  test.equal(_.size(ItemA.getFields()), 4,
    'The "ItemA" class should have 4 fields'
  );

  ItemA.addFields({
    boolean: {
      type: 'Boolean'
    },
    date: {
      type: 'Date'
    }
  });
  test.equal(_.size(ItemA.getFields()), 6,
    'The "ItemA" class should have 6 fields'
  );

  var ItemB = Astro.Class({
    name: 'ItemB',
    collection: Items,
    fields: ['field']
  });
  test.equal(_.size(ItemB.getFields()), 2,
    'The "ItemB" class should have 2 fields'
  );
  test.instanceOf(ItemB.getField('_id'), Astro.FieldDefinition,
    'The "ItemB" class should have the "_id" field'
  );
});
