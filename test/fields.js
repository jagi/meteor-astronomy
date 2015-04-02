Tinytest.add('Class fields', function(test) {
  var Parent = Astronomy.Model({
    name: 'Parent',
    fields: {
      parentFieldA: null,
      parentFieldB: null,
      parentFieldC: null,
      parentFieldD: null
    }
  });

  var Child = Astronomy.Model({
    name: 'Child',
    extend: Parent,
    fields: {
      childFieldA: null,
      childFieldB: null,
      childFieldC: null,
      childFieldD: null
    }
  });

  var Item = Astronomy.Model({
    name: 'Item',
    fields: {
      itemFieldA: null,
      itemFieldB: null,
      itemFieldC: null,
      itemFieldD: null
    }
  });

  test.equal(Item.schema.getFieldsNames().length, 5,
    'Non inherited class should should have 5 (4 defined + `_id`) fields'
  );
  test.equal(Child.schema.getFieldsNames().length, 6,
    'Child class should should have 6 (4 defined + `_type`, `_id`) fields'
  );
  test.equal(Child.schema.getFieldsNames(true).length, 10,
    'Child class should should have 10 (4 defined in child + 4 defined in parent + `_type`, `_id`) fields'
  );

  // Add fields to non inherited class.
  Item.schema.addField('itemFieldE', null);
  test.equal(Item.schema.getFieldsNames().length, 6,
    'After addField(fieldName, null) non inherited class should have 6 (5 defined + `_id`) fields'
  );
  Item.schema.addField('itemFieldF');
  test.equal(Item.schema.getFieldsNames().length, 7,
    'After addField(fieldName) non inherited class should have 7 (6 defined + `_id`) fields'
  );
  Item.schema.addFields({
    'itemFieldG': null
  });
  test.equal(Item.schema.getFieldsNames().length, 8,
    'After addFields({}) non inherited class should have 8 (7 defined + `_id`) fields'
  );
  Item.schema.addFields(['itemFieldH']);
  test.equal(Item.schema.getFieldsNames().length, 9,
    'After addFields([]) non inherited class should have 9 (8 defined + `_id`) fields'
  );

  // Add fields to parent class.
  Parent.schema.addField('parentFieldE', null);
  test.equal(Child.schema.getFieldsNames(true).length, 11,
    'After addField(fieldName, null) on parent class, child class should have 11 (4 defined in child + 5 defined in parent + `_type`, `_id`) fields'
  );
  Parent.schema.addField('parentFieldF');
  test.equal(Child.schema.getFieldsNames(true).length, 12,
    'After addField(fieldName) on parent class, child class should have 12 (4 defined in child + 6 defined in parent + `_type`, `_id`) fields'
  );
  Parent.schema.addFields({
    'parentFieldG': null
  });
  test.equal(Child.schema.getFieldsNames(true).length, 13,
    'After addFields({}) on parent class, child class should have 13 (4 defined in child + 7 defined in parent + `_type`, `_id`) fields'
  );
  Parent.schema.addFields(['parentFieldH']);
  test.equal(Child.schema.getFieldsNames(true).length, 14,
    'After addFields([]) on parent class, child class should have 14 (4 defined in child + 8 defined in parent + `_type`, `_id`) fields'
  );
});
