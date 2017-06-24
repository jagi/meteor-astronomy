import has from 'lodash/has';

function hasHelper(helperName) {
  return has(this.schema.helpers, helperName);
};

export default hasHelper;