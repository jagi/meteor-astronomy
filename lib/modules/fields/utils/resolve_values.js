import {
  each
}
from 'lodash';

function resolveValues(args = {}) {
  const {
    Class,
    values
  } = args;
  const fields = Class.getFields();
  const resolvedValues = {};
  each(fields, (field) => {
    resolvedValues[field.name] = field.resolveValue(values);
  });
  return resolvedValues;
}

export default resolveValues;