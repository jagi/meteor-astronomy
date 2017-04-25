import _ from 'lodash';

function isSecured(operation) {
  if (_.has(this.schema.secured, operation)) {
    return this.schema.secured[operation];
  }
  else {
    let common = this.schema.secured.common;
    return common !== undefined ? common : false;
  }
};

export default isSecured;
