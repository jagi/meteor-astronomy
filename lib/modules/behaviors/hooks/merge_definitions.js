import each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  each(sourceDefinition.behaviors, (behaviors, behaviorName) => {
    targetDefinition.behaviors[behaviorName] =
      targetDefinition.behaviors[behaviorName] || [];
    targetDefinition.behaviors[behaviorName].push(...behaviors);
  });
};

export default onMergeDefinitions;