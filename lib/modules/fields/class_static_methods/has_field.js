import has from 'lodash/has';

function hasField(fieldName) {
  return has(this.schema.fields, fieldName);
};

export default hasField;