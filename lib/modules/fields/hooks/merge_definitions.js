import each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, className) {
  each(sourceDefinition.fields, function(fieldDefinition, fieldName) {
    targetDefinition.fields[fieldName] = fieldDefinition;
  });
};

export default onMergeDefinitions;