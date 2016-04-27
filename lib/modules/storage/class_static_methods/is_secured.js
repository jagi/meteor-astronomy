function isSecured(operation) {
  if (_.has(this.schema.secured, operation)) {
    return this.schema.secured[operation];
  }
  else {
    return this.schema.secured.common || false;
  }
};

export default isSecured;