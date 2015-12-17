Tinytest.add('Fields - Default', function(test) {
  reset();

  let DefaultNested = Astro.Class.create({
    name: 'DefaultNested',
    fields: {
      'anything': {
        default: function() {
          return {
            'string': 'string'
          };
        }
      },
      'string': {
        type: 'string',
        default: 'string'
      },
      'number': {
        type: 'number',
        default: 123
      },
      'boolean': {
        type: 'boolean',
        default: true
      },
      'date': {
        type: 'date',
        default: function() {
          return new Date(2000, 0, 1);
        }
      }
    }
  });

  // Define simple class to work with.
  let Default = Astro.Class.create({
    name: 'Default',
    nested: {
      'one': {
        count: 'one',
        class: 'DefaultNested',
        default: function() {
          return new DefaultNested();
        }
      },
      'many': {
        count: 'many',
        class: 'DefaultNested',
        default: function() {
          return [new DefaultNested()];
        }
      },
    },
    fields: {
      'anything': {
        default: function() {
          return {
            'string': 'string'
          };
        }
      },
      'string': {
        type: 'string',
        default: 'string'
      },
      'number': {
        type: 'number',
        default: 123
      },
      'boolean': {
        type: 'boolean',
        default: true
      },
      'date': {
        type: 'date',
        default: function() {
          return new Date(2000, 0, 1);
        }
      }
    }
  });

  let doc = new Default();

  test.equal(doc.anything, {'string': 'string'},
    'The default value of the "anything" field is not correct'
  );
  test.equal(doc.string, 'string',
    'The default value of the "string" field is not correct'
  );
  test.equal(doc.number, 123,
    'The default value of the "number" field is not correct'
  );
  test.equal(doc.boolean, true,
    'The default value of the "boolean" field is not correct'
  );
  test.equal(doc.date, new Date(2000, 0, 1),
    'The default value of the "date" field is not correct'
  );
  test.equal(doc.one, new DefaultNested(),
    'The default value of the "one" field is not correct'
  );
  test.equal(doc.many, [new DefaultNested()],
    'The default value of the "many" field is not correct'
  );
});
