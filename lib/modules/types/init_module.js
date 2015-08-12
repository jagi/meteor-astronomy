Astro.types = {};

Astro.registerType = function(definition) {
  var typeDefinition = new Astro.TypeDefinition(definition);
  Astro.types[typeDefinition.name] = typeDefinition;
};

Astro.createType = function() {
  console.trace(
    'ASTRONOMY: The "Astro.createType" function is deprecated and ' +
    'will be removed on v1.0 release. Use the "Astro.registerType" function ' +
    'instead.'
  );

  Astro.registerType.apply(this, arguments);
};
