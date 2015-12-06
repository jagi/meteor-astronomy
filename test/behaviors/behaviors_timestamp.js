Tinytest.addAsync('Behaviors - Timestamp', function(test, next) {
  // Reset Astro.
  reset();

  var TimestampsA = new Mongo.Collection(null);
  var TimestampsB = new Mongo.Collection(null);
  var TimestampsC = new Mongo.Collection(null);

  TimestampsA.find({}, {
    transform: null
  }).forEach(function(item) {
    TimestampsA.remove(item._id);
  });

  TimestampsB.find({}, {
    transform: null
  }).forEach(function(item) {
    TimestampsB.remove(item._id);
  });

  TimestampsC.find({}, {
    transform: null
  }).forEach(function(item) {
    TimestampsC.remove(item._id);
  });

  var TimestampA = Astro.Class.create({
    name: 'TimestampA',
    collection: TimestampsA,
    fields: {
      name: 'string'
    },
    behaviors: {
      timestamp: {}
    }
  });

  var TimestampB = Astro.Class.create({
    name: 'TimestampB',
    collection: TimestampsB,
    fields: {
      name: 'string'
    },
    behaviors: {
      timestamp: {
        createdFieldName: 'created',
        updatedFieldName: 'updated'
      }
    }
  });

  var TimestampC = Astro.Class.create({
  name: 'TimestampC',
  collection: TimestampsC,
  fields: {
    name: 'string'
  },
  behaviors: {
    timestamp: {
      hasCreatedField: false,
      hasUpdatedField: false
    }
  }
});

  var timestampA = new TimestampA({
    name: 'TimestampA'
  });
  timestampA.save();

  test.instanceOf(timestampA.get('createdAt'), Date,
    'The "createdAt" field should be instance of Date'
  );
  test.instanceOf(timestampA.get('updatedAt'), Date,
    'The "updatedAt" field should be instance of Date'
  );
  test.equal(timestampA.get('createdAt'), timestampA.get('updatedAt'),
    'The "createdAt" and "updatedAt" fields should be equal'
  );

  timestampA.set('name', 'TimestampA2');

  Meteor.setTimeout(function() {
    timestampA.save();
    test.isTrue(timestampA.get('createdAt') < timestampA.get('updatedAt'),
      'The value of the "updatedAt" field should be greater than the value ' +
      'of the "createdAt" field'
    );
    next();
  }, 1);

  var timestampB = new TimestampB({
    name: 'TimestampB'
  });
  timestampB.save();

  test.instanceOf(timestampB.get('created'), Date,
    'The "created" field should be instance of Date'
  );
  test.instanceOf(timestampB.get('updated'), Date,
    'The "updated" field should be instance of Date'
  );
  test.equal(timestampB.get('created'), timestampB.get('updated'),
    'The "created" and "updated" fields should be equal'
  );

  var timestampC = new TimestampC({
    name: 'TimestampC'
  });
  timestampC.save();

  test.isUndefined(timestampC.get('createdAt'),
    'The "createdAt" field should be undefined'
  );
  test.isUndefined(timestampC.get('updatedAt'),
    'The "updatedAt" field should be undefined'
  );
});
