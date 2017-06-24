import has from 'lodash/has';

function isSecured(operation) {
  if (has(this.schema.secured, operation)) {
    return this.schema.secured[operation];
  }
  else {
    let common = this.schema.secured.common;
    return common !== undefined ? common : true;
  }
};

export default isSecured;