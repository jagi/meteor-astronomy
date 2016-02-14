Tinytest.add('Methods - Modules - Definition', function(test) {
  // Reset Astro.
  reset();

  var Method = Astro.Class.create({
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

  var method = new Method({
    string: 'string',
    number: 123
  });

  test.equal(method.methodA(), 'string123',
    'The "methodA" method should return "string123"'
  );
});
