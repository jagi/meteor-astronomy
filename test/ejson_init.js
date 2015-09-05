Tinytest.add('EJSON - Init', function(test) {
  // Reset Astronomy.
  reset();

  EJSONClass = Astro.Class({
    name: 'EJSONClass',
    fields: {
      'object': {
        type: 'object'
      },
      'array': {
        type: 'array'
      },
      'string': {
        type: 'string'
      },
      'number': {
        type: 'number'
      },
      'boolean': {
        type: 'boolean'
      },
      'date': {
        type: 'date'
      }
    }
  });
});
