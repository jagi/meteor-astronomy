import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  _each(sourceDefinition.helpers, function(helper, helperName) {
    targetDefinition.helpers[helperName] = helper;
  });
};

export default onMergeDefinitions;