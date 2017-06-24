import each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  const schema = Class.schema;

  // Add Meteor methods to the class schema.
  each(parsedDefinition.meteorMethods, (method, methodName) => {
    schema.methods[methodName] = method;
  });
};

export default onApplyDefinition;