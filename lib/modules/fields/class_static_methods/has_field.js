import _has from 'lodash/has';

function hasField(fieldName) {
  return _has(this.schema.fields, fieldName);
};

export default hasField;