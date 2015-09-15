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
  test.isUndefined(DefinitionA.getField('_id'),
    'Class without provided collection should not have the "_id" field'
  );

  var DefinitionB = Astro.Class({
    name: 'DefinitionB',
    fields: {
      'string': 'string'
    }
  });
  test.instanceOf(DefinitionB.getField('string'), Astro.fields.string,
    'The type of the "string" field should be "string"'
  );

  var DefinitionC = Astro.Class({
    name: 'DefinitionC',
    fields: {
      'number': {
        type: 'number'
      }
    }
  });
  test.instanceOf(DefinitionC.getField('number'), Astro.fields.number,
    'The type of the "number" field should be "number"'
  );

  var Definitions = new Mongo.Collection(null);
  var DefinitionD = Astro.Class({
    name: 'DefinitionD',
    collection: Definitions,
    fields: ['field']
  });
  test.equal(_.size(DefinitionD.getFields()), 2,
    'The "DefinitionD" class should have 2 fields'
  );
  test.isNotNull(DefinitionD.getField('_id'),
    'The "DefinitionD" class should have the "_id" field'
  );
});
