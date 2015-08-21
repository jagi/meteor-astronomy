Tinytest.add('Methods - Init', function(test) {
  Astro.classes = [];

  Method = Astro.Class({
    name: 'Method',
    fields: {
      string: 'string',
      number: 'number'
    },
    methods: {
      methodA: function() {
        return this.string + this.number;
      }
    }
  });

  Method.addMethod('methodB', function() {
    return this.string + this.number;
  });
});
