eventsOnInitModule = function() {
  // Allow the global "Astronomy" object to store events.
  EventList.mixin(Astro);
};
