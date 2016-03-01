function isNestedFieldName(fieldPattern) {
  return fieldPattern.indexOf('.') !== -1;
};

export default isNestedFieldName;