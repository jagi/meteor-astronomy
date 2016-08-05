import _ from 'lodash';
import AstroClass from '../../../core/class.js';
import resolveValues from '../../fields/utils/resolve_values.js';

function transformToClass(className, options = {}) {
  // Set default options.
  _.defaults(options, {
    defaults: true
  });
  options.clone = false;

  return function(rawDoc) {
    let Class = AstroClass.get(className);

    if (Class) {
      const typeField = Class.getTypeField();
      if (typeField) {
        const TypeClass = AstroClass.get(rawDoc[typeField]);
        if (TypeClass) {
          Class = TypeClass;
        }
      }

      // Resolve values using the "resolveValue" method if provided.
      const resolvedDoc = resolveValues({
        Class,
        values: rawDoc
      });

      const doc = new Class(resolvedDoc, options);
      doc._isNew = false;
      return doc;
    }

    return rawDoc;
  };
};

export default transformToClass;
