Tinytest.add('Fields - Definition', function(test) {
  var FieldA = Astro.Class({
    name: 'FieldA',
    fields: ['nullA']
  });
  test.isNull(FieldA.getField('nullA').type,
    'The type of the "nullA" field should be null'
  );

  FieldA.addField('nullB');
  test.isNull(FieldA.getField('nullB').type,
    'The type of the "nullB" field should be null'
  );

  FieldA.addField('string', 'string');
  test.equal(FieldA.getField('string').type, 'string',
    'The type of the "string" field should be "string"'
  );

  FieldA.addField('number', {
    type: 'number'
  });
  test.equal(FieldA.getField('number').type, 'number',
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
  test.equal(FieldA.getField('boolean').type, 'boolean',
    'The type of the "boolean" field should be "boolean"'
  );
  test.equal(FieldA.getField('date').type, 'date',
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

  test.instanceOf(Field.getField('object'), Astro.EmbedOneField,
    'The "object" field should be instace of the "Astro.EmbedOneField" class'
  );

  test.instanceOf(Field.getField('array'), Astro.EmbedManyField,
    'The "array" field should be instace of the "Astro.EmbedManyField" class'
  );
});
