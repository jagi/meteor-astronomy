import {
  each
} from 'lodash';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  each(sourceDefinition.meteorMethods, function(method, methodName) {
    targetDefinition.meteorMethods[methodName] = method;
  });
};

export default onMergeDefinitions;