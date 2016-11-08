import {
  has
}
from 'lodash';

function hasField(fieldName) {
  return has(this.schema.fields, fieldName);
};

export default hasField;