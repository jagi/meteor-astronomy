Tinytest.add('Methods module - Methods definition', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
    fields: {
      stringField: 'string',
      numberField: 'number'
    },
    methods: {
      methodA: function() {
        return this.stringField + this.numberField;
      }
    }
  });

  Item.addMethod('methodB', function() {
    return this.stringField + this.numberField;
  });

  test.equal(_.size(Item.getMethods()), 2,
    'The "Item" class should have 2 methods'
  );
});
