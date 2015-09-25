Astro.createType({
  name: 'null',
  constructor: function NullField() {
    Astro.BaseField.apply(this, arguments);
  }
});
