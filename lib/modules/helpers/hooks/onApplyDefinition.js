import _each from 'lodash/each';

function onApplyDefinition(Class, parsedDefinition, className) {
  let schema = Class.schema;

  // Add helpers to the class.
  _each(parsedDefinition.helpers, (helper, helperName) => {
    schema.helpers[helperName] = helper;
    Class.prototype[helperName] = helper;
  });
};

export default onApplyDefinition;