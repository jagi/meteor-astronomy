import each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, className) {
  each(sourceDefinition.meteorMethods, function(method, methodName) {
    targetDefinition.meteorMethods[methodName] = method;
  });
};

export default onMergeDefinitions;