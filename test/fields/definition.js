Tinytest.add('Fields - Definition', function(test) {
  reset();

  let DefinitionA = Astro.Class.create({
    name: 'DefinitionA',
    // No definition provided.
    fields: ['null']
  });
  test.isNull(DefinitionA.getField('null').type,
    'The type of the "null" should not be defined'
  );

  let DefinitionB = Astro.Class.create({
    name: 'DefinitionB',
    fields: {
      // Field type provided.
      'string': 'string',
      // Field definition provided.
      'number': {
        type: 'number'
      }
    }
  });
  test.equal(DefinitionB.getField('string').type, Astro.Type.types.string,
    'The type of the "string" field should be "string"'
  );
  test.equal(DefinitionB.getField('number').type, Astro.Type.types.number,
    'The type of the "number" field should be "number"'
  );
});
