import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
  _each(sourceDefinition.indexes, function(index, indexName) {
    targetDefinition.indexes[indexName] = index;
  });
};

export default onMergeDefinitions;