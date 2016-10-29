import {
  extend
}
from 'lodash';
import AstroClass from '../../../core/class';
import castToClass from '../../fields/utils/castToClass';
import resolveValues from '../../fields/utils/resolve_values';

function transformToClass(className, options = {}) {
  // When fetching document from collection we don't want to clone raw document
  // and we want default values to be set.
  extend(options, {
    defaults: true,
    clone: false,
    cast: false
  });

  return function(rawDoc) {
    let Class = AstroClass.get(className);

    if (Class) {
      const doc = castToClass({
        Class,
        // Resolve values using the "resolveValue" method if provided.
        rawDoc: resolveValues({
          Class,
          values: rawDoc
        }),
        options
      });
      // Document fetched from collection are not new.
      doc._isNew = false;
      return doc;
    }

    return rawDoc;
  };
};

export default transformToClass;
