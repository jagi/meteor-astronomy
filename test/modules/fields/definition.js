Tinytest.add('Fields - Modules - Definition', function(test) {
  reset();

  let Definition = Astro.Class.create({
    name: 'Definition',
    fields: {
      // Field type provided.
      string: {
        type: String
      },
      // Field definition provided.
      number: {
        type: Number
      }
    }
  });

  test.equal(Definition.getField('string').type.name, 'String',
    'The type of the "string" field should be "string"'
  );
  test.equal(Definition.getField('number').type.name, 'Number',
    'The type of the "number" field should be "number"'
  );
});