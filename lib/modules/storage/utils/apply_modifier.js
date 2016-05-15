import _ from 'lodash';
import castNested from '../../fields/utils/cast_nested.js';
import setAll from '../../fields/utils/set_all.js';

function applyModifier({
  doc,
  modifier,
  options
}) {
  // Apply modifier only if provided.
  if (modifier && _.size(modifier) > 0) {
    // Get raw object because the "_modify" method can only work with plain
    // objects.
    const plainDoc = doc.raw();
    // Use Minimongo's the "_modify" method to apply modifier.
    LocalCollection._modify(plainDoc, modifier, options);
    // Set all values back again on a document.
    setAll(doc, plainDoc);
  }
};

export default applyModifier;