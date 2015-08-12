Tinytest.add('Behaviors - Timestamp', function(test) {
  Timestamps = new Mongo.Collection(null);

  TimestampA = Astro.Class({
    name: 'TimestampA',
    collection: Timestamps,
    fields: {
      name: 'String'
    },
    behaviors: {
      timestamp: {}
    }
  });

  var timestampA = new TimestampA({
    name: 'TimestampA'
  });
  timestampA.save();

  test.instanceOf(timestampA.createdAt, Date,
    'The "createdAt" field should be instance of Date'
  );
  test.instanceOf(timestampA.updatedAt, Date,
    'The "updatedAt" field should be instance of Date'
  );
  test.equal(timestampA.createdAt, timestampA.updatedAt,
    'The "createdAt" and "updatedAt" fields should be equal'
  );

  timestampA.set('name', 'updated');
  timestampA.save();

  test.isTrue(timestampA.createdAt < timestampA.updatedAt,
    'The value of the "updatedAt" field should be greater than the value ' +
    'of the "createdAt" fields'
  );

  TimestampB = Astro.Class({
    name: 'TimestampB',
    collection: Timestamps,
    fields: {
      name: 'String'
    },
    behaviors: {
      timestamp: {
        createdFieldName: 'created',
        updatedFieldName: 'updated'
      }
    }
  });

  var timestampB = new TimestampB({
    name: 'TimestampB'
  });
  timestampB.save();

  test.instanceOf(timestampB.created, Date,
    'The "created" field should be instance of Date'
  );
  test.instanceOf(timestampB.updated, Date,
    'The "updated" field should be instance of Date'
  );
  test.equal(timestampB.created, timestampB.updated,
    'The "created" and "updated" fields should be equal'
  );

  TimestampC = Astro.Class({
    name: 'TimestampC',
    collection: Timestamps,
    fields: {
      name: 'String'
    },
    behaviors: {
      timestamp: {
        hasCreatedField: false,
        hasUpdatedField: false
      }
    }
  });

  var timestampC = new TimestampC({
    name: 'TimestampC'
  });
  timestampC.save();

  test.isUndefined(timestampC.createdAt,
    'The "createdAt" field should be undefined'
  );
  test.isUndefined(timestampC.updatedAt,
    'The "updatedAt" field should be undefined'
  );
});
