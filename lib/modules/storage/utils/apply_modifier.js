import castNested from '../../fields/utils/cast_nested.js';

function applyModifier({
  doc,
  modifier,
  options
}) {
  // Apply modifier only if it was provided.
  if (modifier && _.size(modifier) > 0) {
    // Use Minimongo "_modify" method to apply modifier.
    LocalCollection._modify(doc, modifier, options);

    // Cast values that was set using modifier.
    castNested(doc);
  }
};

export default applyModifier;