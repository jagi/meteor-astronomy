Tinytest.add('Fields - Modules - Default', function(test) {
  reset();

  let DefaultNested = Astro.Class.create({
    name: 'DefaultNested',
    fields: {
      string: {
        type: String,
        default: 'abc'
      },
      number: {
        type: Number,
        default: 123
      },
      boolean: {
        type: Boolean,
        default: true
      },
      date: {
        type: Date,
        default: function() {
          return new Date(2000, 0, 1);
        }
      }
    }
  });

  // Define simple class to work with.
  let Default = Astro.Class.create({
    name: 'Default',
    fields: {
      one: {
        type: DefaultNested,
        default: function() {
          return new DefaultNested();
        }
      },
      many: {
        type: [DefaultNested],
        default: function() {
          return [new DefaultNested()];
        }
      },
      string: {
        type: String,
        default: 'abc'
      },
      number: {
        type: Number,
        default: 123
      },
      boolean: {
        type: Boolean,
        default: true
      },
      date: {
        type: Date,
        default: function() {
          return new Date(2000, 0, 1);
        }
      }
    }
  });

  let doc = new Default();

  test.equal(doc.string, 'abc',
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
