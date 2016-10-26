function getHelper(helperName) {
  return this.schema.helpers[helperName];
};

export default getHelper;