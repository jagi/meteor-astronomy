import _has from 'lodash/has';

function hasHelper(helperName) {
  return _has(this.schema.helpers, helperName);
};

export default hasHelper;