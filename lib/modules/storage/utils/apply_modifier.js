import _size from 'lodash/size';
import config from '../../../core/config';
import castNested from '../../fields/utils/castNested';
import setAll from '../../fields/utils/set_all';
import { LocalCollection } from 'meteor/minimongo';

function applyModifier(args = {}) {
  const {
    doc,
    modifier,
    options
  } = args;
  // Apply modifier only if provided.
  if (modifier && _size(modifier) > 0) {
    // Get raw object because the "_modify" method can only work with plain
    // objects.
    const rawDoc = doc.raw();
    // Use Minimongo's the "_modify" method to apply modifier.
    LocalCollection._modify(rawDoc, modifier, options);
    // Set all values back again on a document.
    setAll(doc, rawDoc, {
      defaults: config.defaults,
      clone: false,
      cast: false
    });
  }
};

export default applyModifier;