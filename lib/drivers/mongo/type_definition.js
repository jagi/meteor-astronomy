var base = Astro.base;
var mongo = Astro.getDriver('mongo');

mongo.TypeDefinition = base.TypeDefinition;
