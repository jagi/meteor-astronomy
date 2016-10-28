import {
  values
}
from 'lodash';

function getFields() {
  return values(this.schema.fields);
};

export default getFields;