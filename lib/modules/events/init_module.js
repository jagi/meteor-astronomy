// Allow storing events in the global "Astronomy.eventManager" object.
Astro.eventManager = {};
Astro.Events.mixin(Astro.eventManager);

// Allow storing events in every schema.
Astro.Events.mixin(Astro.Schema);
