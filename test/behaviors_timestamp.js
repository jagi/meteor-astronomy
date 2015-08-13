Tinytest.addAsync('Behaviors - Timestamp', function(test, next) {
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

  test.instanceOf(timestampB.get('created'), Date,
    'The "created" field should be instance of Date'
  );
  test.instanceOf(timestampB.get('updated'), Date,
    'The "updated" field should be instance of Date'
  );
  test.equal(timestampB.get('created'), timestampB.get('updated'),
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

  test.isUndefined(timestampC.get('createdAt'),
    'The "createdAt" field should be undefined'
  );
  test.isUndefined(timestampC.get('updatedAt'),
    'The "updatedAt" field should be undefined'
  );
});
