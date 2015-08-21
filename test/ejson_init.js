Tinytest.add('EJSON - Init', function(test) {
  Astro.classes = [];

  EJSONClass = Astro.Class({
    name: 'EJSONClass',
    embedOne: {
      'object': {}
    },
    embedMany: {
      'array': {}
    },
    fields: {
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
