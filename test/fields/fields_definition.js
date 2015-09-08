Tinytest.add('Fields - Definition', function(test) {
  // Reset Astronomy.
  reset();

  var DefinitionA = Astro.Class({
    name: 'DefinitionA',
    fields: ['nullA']
  });
  test.instanceOf(DefinitionA.getField('nullA'), Astro.fields.null,
    'The type of the "nullA" field should be "null"'
  );

  DefinitionA.addField('nullB');
  test.instanceOf(DefinitionA.getField('nullB'), Astro.fields.null,
    'The type of the "nullB" field should be "null"'
  );

  DefinitionA.addField('string', 'string');
  test.instanceOf(DefinitionA.getField('string'), Astro.fields.string,
    'The type of the "string" field should be "string"'
  );

  DefinitionA.addField('number', {
    type: 'number'
  });
  test.instanceOf(DefinitionA.getField('number'), Astro.fields.number,
    'The type of the "number" field should be "number"'
  );

  DefinitionA.addFields({
    'boolean': {
      type: 'boolean'
    },
    'date': {
      type: 'date'
    },
    'object': {
      type: 'object'
    },
    'array': {
      type: 'array'
    }
  });
  test.instanceOf(DefinitionA.getField('boolean'), Astro.fields.boolean,
    'The type of the "boolean" field should be "boolean"'
  );
  test.instanceOf(DefinitionA.getField('date'), Astro.fields.date,
    'The type of the "date" field should be "date"'
  );
  test.instanceOf(DefinitionA.getField('object'), Astro.fields.object,
    'The "object" field should be instace of the "Astro.fields.object" class'
  );
  test.instanceOf(DefinitionA.getField('array'), Astro.fields.array,
    'The "array" field should be instace of the "Astro.fields.array" class'
  );

  var Definitions = new Mongo.Collection(null);

  var DefinitionB = Astro.Class({
    name: 'DefinitionB',
    collection: Definitions,
    fields: ['field']
  });
  test.equal(_.size(DefinitionB.getFields()), 2,
    'The "DefinitionB" class should have 2 fields'
  );
  test.isNotNull(DefinitionB.getField('_id'),
    'The "DefinitionB" class should have the "_id" field'
  );
});
