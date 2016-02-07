Astro.utils.storage.applyModifier = function(doc, modifier) {
  // Use Minimongo "_modify" method to apply modifier.
  LocalCollection._modify(doc, modifier);

  // Cast values that was set using modifier.
  Astro.utils.fields.castNested(doc);
};