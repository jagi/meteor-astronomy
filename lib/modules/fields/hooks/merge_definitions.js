function onMergeDefinitions(targetDefinition, sourceDefinition, className) {
  _.each(sourceDefinition.fields, function(fieldDefinition, fieldName) {
    targetDefinition.fields[fieldName] = fieldDefinition;
  });
};

export default onMergeDefinitions;