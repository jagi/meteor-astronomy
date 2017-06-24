import each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  each(sourceDefinition.indexes, function(index, indexName) {
    targetDefinition.indexes[indexName] = index;
  });
};

export default onMergeDefinitions;