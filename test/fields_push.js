Tinytest.add('Fields - Push', function(test) {
  var NestedPush = Astro.Class({
    name: 'NestedPush'
  });

  var Push = Astro.Class({
    name: 'Push',
    embedMany: {
      arrayA: {
        default: function() {
          return [];
        }
      },
      arrayB: {
        default: function() {
          return [];
        }
      },
      typedArrayA: {
        type: 'string',
        default: function() {
          return [];
        }
      },
      typedArrayB: {
        type: 'string',
        default: function() {
          return [];
        }
      },
      classArrayA: {
        class: 'NestedPush',
        default: function() {
          return [];
        }
      },
      classArrayB: {
        class: 'NestedPush',
        default: function() {
          return [];
        }
      }
    }
  });
  var push = new Push();

  // Non-typed arrays.
  push.push('arrayA', 1);
  test.equal(push.get('arrayA'), [1],
    'Pushing a single value into the non-typed array field should succeed'
  );

  push.push({
    'arrayA': 2,
    'arrayB': 1,
  });
  test.equal(
    push.get(['arrayA', 'arrayB']),
    {
      'arrayA': [1, 2],
      'arrayB': [1]
    },
    'Pushing multiple values into the non-typed array field should succeed'
  );

  // Typed arrays.
  push.push('typedArrayA', 1);
  test.equal(push.get('typedArrayA'), ['1'],
    'Pushing a single value into the typed array field should succeed'
  );

  push.push({
    'typedArrayA': 2,
    'typedArrayB': 1,
  });
  test.equal(
    push.get(['typedArrayA', 'typedArrayB']),
    {
      'typedArrayA': ['1', '2'],
      'typedArrayB': ['1']
    },
    'Pushing multiple values into the typed array field should succeed'
  );

  // Class arrays.
  push.push('classArrayA', {});
  test.instanceOf(push.get('classArrayA.0'), NestedPush,
    'Pushing a single value into the class typed array field should succeed'
  );

  push.push({
    'classArrayA': {},
    'classArrayB': {},
  });
  test.instanceOf(push.get('classArrayB.0'), NestedPush,
    'Pushing multiple values into the class typed array field should succeed'
  );
});
