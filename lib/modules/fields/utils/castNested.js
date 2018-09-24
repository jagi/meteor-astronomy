import _each from 'lodash/each';
import ObjectField from '../ObjectField';
import ListField from '../ListField';

function castNested(args = {}) {
  const {
    doc,
    options
  } = args;
  const Class = doc.constructor;

  _each(Class.getFields(), (field) => {
    if (
      (field instanceof ObjectField) ||
      (field instanceof ListField && field.isClass)
    ) {
      doc[field.name] = field.castValue(doc[field.name], options);
    }
  });
};

export default castNested;