Astro.Module.modules.methods.onMergeDefinitions = function(
  targetDefinition, sourceDefinition, ClassName
) {
  _.each(sourceDefinition.methods, function(method, methodName) {
    targetDefinition.methods[methodName] = method;
  });
};
