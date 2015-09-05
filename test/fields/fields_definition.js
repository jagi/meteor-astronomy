Tinytest.add('Fields - Definition', function(test) {
  var FieldA = Astro.Class({
    name: 'FieldA',
    fields: ['nullA']
  });
  test.instanceOf(FieldA.getField('nullA'), Astro.fields.null,
    'The type of the "nullA" field should be "null"'
  );

  FieldA.addField('nullB');
  test.instanceOf(FieldA.getField('nullB'), Astro.fields.null,
    'The type of the "nullB" field should be "null"'
  );

  FieldA.addField('string', 'string');
  test.instanceOf(FieldA.getField('string'), Astro.fields.string,
    'The type of the "string" field should be "string"'
  );

  FieldA.addField('number', {
    type: 'number'
  });
  test.instanceOf(FieldA.getField('number'), Astro.fields.number,
    'The type of the "number" field should be "number"'
  );

  FieldA.addFields({
    'boolean': {
      type: 'boolean'
    },
    'date': {
      type: 'date'
    }
  });
  test.instanceOf(FieldA.getField('boolean'), Astro.fields.boolean,
    'The type of the "boolean" field should be "boolean"'
  );
  test.instanceOf(FieldA.getField('date'), Astro.fields.date,
    'The type of the "date" field should be "date"'
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

  test.instanceOf(Field.getField('object'), Astro.fields.object,
    'The "object" field should be instace of the "Astro.fields.object" class'
  );

  test.instanceOf(Field.getField('array'), Astro.fields.array,
    'The "array" field should be instace of the "Astro.fields.array" class'
  );
});
