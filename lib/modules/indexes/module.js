Astro.createModule({
  name: 'indexes',
  init: fieldsOnInitModule,
  events: {
    initclass: indexesOnInitClass
  }
});
