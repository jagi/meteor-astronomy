import _values from 'lodash/values';

function getFields() {
  return _values(this.schema.fields);
};

export default getFields;