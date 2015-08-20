Tinytest.add('Fields - Definition', function(test) {
  var FieldA = Astro.Class({
    name: 'FieldA',
    fields: ['nullA']
  });
  test.equal(FieldA.getField('nullA').type.name, 'Null',
    'The type of the "nullA" field should be "Null"'
  );

  FieldA.addField('nullB');
  test.equal(FieldA.getField('nullB').type.name, 'Null',
    'The type of the "nullB" field should be "Null"'
  );

  FieldA.addField('string', 'String');
  test.equal(FieldA.getField('string').type.name, 'String',
    'The type of the "string" field should be "String"'
  );

  FieldA.addField('number', {
    type: 'Number'
  });
  test.equal(FieldA.getField('number').type.name, 'Number',
    'The type of the "number" field should be "Number"'
  );

  FieldA.addFields({
    'boolean': {
      type: 'Boolean'
    },
    'date': {
      type: 'Date'
    }
  });
  test.equal(FieldA.getField('boolean').type.name, 'Boolean',
    'The type of the "boolean" field should be "Boolean"'
  );
  test.equal(FieldA.getField('date').type.name, 'Date',
    'The type of the "date" field should be "Date"'
  );

  var FieldB = Astro.Class({
    name: 'FieldB',
    collection: Fields,
    fields: ['field']
  });
  test.equal(_.size(FieldB.getFields()), 2,
    'The "FieldB" class should have 2 fields'
  );
  test.isNotNull(FieldB.getField('_id'),
    'The "FieldB" class should have the "_id" field'
  );

  test.equal(Field.getField('nested').type.name, 'NestedField',
    'The type of the "nested" field should be "NestedField"'
  );
});
