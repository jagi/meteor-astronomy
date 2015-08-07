removeAllItems = function() {
  Items.find({}, {
    transform: null
  }).forEach(function(item) {
    Items.remove(item._id);
  });
};

Tinytest.add('Init', function(test) {
  // Create collection.
  Items = new Mongo.Collection('items');

  // Remove all previously stored documents.
  removeAllItems();

  // Define simple class to work with.
  SimpleItem = Astro.Class({
    name: 'SimpleItem',
    collection: Items,
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
      'date': {
        type: 'Date'
      },
      'object': {
        type: 'Object'
      },
      'array': {
        type: 'Array'
      }
    }
  });
});
