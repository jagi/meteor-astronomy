Tinytest.add('EJSON - Init', function(test) {
  Astro.classes = [];

  EJSONClass = Astro.Class({
    name: 'EJSONClass',
    fields: {
      'string': {
        type: 'String'
      },
      'number': {
        type: 'Number'
      },
      'boolean': {
        type: 'Boolean'
      },
      'object': {
        type: 'Object'
      },
      'array': {
        type: 'Array'
      },
      'date': {
        type: 'Date'
      }
    }
  });
});
