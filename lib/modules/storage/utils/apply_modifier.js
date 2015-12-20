Astro.utils.storage.applyModifier = function(doc, modifier) {
  // Use Minimongo "_modify" method to apply modifier.
  LocalCollection._modify(doc, modifier);

  // Cast values that was set using modifier.
  Astro.utils.fields.castNested(doc);

  // Get modified fields.
  let modified = Astro.utils.storage.getModified(doc);

  // Return modifier only if there were any changed.
  if (_.size(modified)) {
    return {$set: modified};
  }
};