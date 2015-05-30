Astro.createModule({
  name: 'fields',
  init: fieldsOnInitModule,
  events: {
    initclass: fieldsOnInitClass
  }
});
