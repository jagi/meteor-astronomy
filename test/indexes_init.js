Tinytest.add('Indexes - Init', function(test) {
  // Reset Astronomy.
  reset();

  Indexes = new Mongo.Collection('indexes');

  Index = Astro.Class({
    name: 'Index',
    collection: Indexes,
    fields: {
      name: {
        type: 'string',
        index: 1
      }
    }
  });

  console.log(1, Index.schema);
});
