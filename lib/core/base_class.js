var BaseClass = Astro.BaseClass = function() {};

BaseClass.prototype.valueOf = function() {
  var doc = this;

  return Astro.utils.fields.getAllValues(doc, {
    cast: false,
    default: true
  });
};
