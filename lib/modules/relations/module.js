Astro.createModule({
  name: 'relations',
  init: relationsOnInitModule,
  events: {
    initclass: relationsOnInitClass,
    initinstance: relationsOnInitInstance
  }
});
