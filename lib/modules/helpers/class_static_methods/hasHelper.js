import {
  has
}
from 'lodash';

function hasHelper(helperName) {
  return has(this.schema.helpers, helperName);
};

export default hasHelper;