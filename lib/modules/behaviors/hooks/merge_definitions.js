import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  _each(sourceDefinition.behaviors, (behaviors, behaviorName) => {
    targetDefinition.behaviors[behaviorName] =
      targetDefinition.behaviors[behaviorName] || [];
    targetDefinition.behaviors[behaviorName].push(...behaviors);
  });
};

export default onMergeDefinitions;