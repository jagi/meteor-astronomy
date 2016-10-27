import {
  each
}
from 'lodash';
import ObjectField from '../ObjectField';
import ListField from '../ListField';
import castToClass from './castToClass';

function castNested(args = {}) {
  const {
    doc,
    options
  } = args;
  const Class = doc.constructor;

  each(Class.getFields(), (field) => {
    if (field instanceof ObjectField || field instanceof ListField) {
      doc[field.name] = castToClass({
        Class: field.type.class,
        rawDoc: doc[field.name],
        options
      });
    }
  });
};

export default castNested;