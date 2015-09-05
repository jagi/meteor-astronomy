Tinytest.add('Methods - Init', function(test) {
  // Reset Astronomy.
  reset();

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
