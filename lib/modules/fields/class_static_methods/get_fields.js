import values from 'lodash/values';

function getFields() {
  return values(this.schema.fields);
};

export default getFields;