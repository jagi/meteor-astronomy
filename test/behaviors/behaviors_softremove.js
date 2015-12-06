Tinytest.add('Behaviors - Softremove', function(test) {
  // Reset Astro.
  reset();

  SoftremovesA = new Mongo.Collection(null);
  SoftremovesB = new Mongo.Collection(null);
  SoftremovesC = new Mongo.Collection(null);

  SoftremovesA.find({}, {
    transform: null
  }).forEach(function(item) {
    SoftremovesA.remove(item._id);
  });

  SoftremovesB.find({}, {
    transform: null
  }).forEach(function(item) {
    SoftremovesB.remove(item._id);
  });

  SoftremovesC.find({}, {
    transform: null
  }).forEach(function(item) {
    SoftremovesC.remove(item._id);
  });

  var SoftremoveA = Astro.Class.create({
    name: 'SoftremoveA',
    collection: SoftremovesA,
    fields: {
      name: 'string'
    },
    behaviors: {
      softremove: {}
    }
  });

  var SoftremoveB = Astro.Class.create({
    name: 'SoftremoveB',
    collection: SoftremovesB,
    fields: {
      name: 'string'
    },
    behaviors: {
      softremove: {
        removedFieldName: 'deleted',
        hasRemovedAtField: true,
        removedAtFieldName: 'removedDate'
      }
    }
  });

  var SoftremoveC = Astro.Class.create({
    name: 'SoftremoveC',
    collection: SoftremovesC,
    fields: {
      name: 'string'
    },
    behaviors: {
      softremove: {
        hasRemovedAtField: false
      }
    }
  });

  var softremoveA = new SoftremoveA();
  softremoveA.save();
  softremoveA.softRemove();
  test.isTrue(softremoveA.get('removed'),
    'The "removed" flag should be set after soft removing document'
  );
  test.instanceOf(softremoveA.get('removedAt'), Date,
    'The "removedAt" field should be set with a date of document removal'
  );
  test.equal(SoftremovesA.find().count(), 1,
    'Wrong number of fetched documents from the "Collection.find()" method call'
  );
  test.equal(SoftremoveA.find().count(), 0,
    'Wrong number of fetched documents from the "Class.find()" method call'
  );

  var softremoveB = new SoftremoveB();
  softremoveB.save();
  softremoveB.softRemove();
  test.isTrue(softremoveB.get('deleted'),
    'The "deleted" flag should be set after soft removing document'
  );
  test.instanceOf(softremoveB.get('removedDate'), Date,
    'The "removedDate" field should be set with a date of document removal'
  );
  test.equal(SoftremovesB.find().count(), 1,
    'Wrong number of fetched documents from the "Collection.find()" method call'
  );
  test.equal(SoftremoveB.find().count(), 0,
    'Wrong number of fetched documents from the "Class.find()" method call'
  );

  var softremoveC = new SoftremoveC();
  softremoveC.save();
  softremoveC.softRemove();
  test.isUndefined(softremoveC.get('removedAt'),
    'The "removedAt" field should not be available'
  );
  test.equal(SoftremovesC.find().count(), 1,
    'Wrong number of fetched documents from the "Collection.find()" method call'
  );
  test.equal(SoftremoveC.find().count(), 0,
    'Wrong number of fetched documents from the "Class.find()" method call'
  );
});
