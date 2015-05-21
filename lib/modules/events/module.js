Astro.createModule({
  name: 'events',
  init: eventsOnInitModule,
  events: {
    initclass: eventsOnInitClass
  }
});
