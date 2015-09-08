Tinytest.add('Methods - Definition', function(test) {
  // Reset Astronomy.
  reset();

  var Method = Astro.Class({
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

  var method = new Method({
    string: 'string',
    number: 123
  });

  test.equal(method.methodA(), 'string123',
    'The "methodA" method should return "string123"'
  );
});
