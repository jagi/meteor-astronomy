Astro.Module = class Module {
  constructor() {}

  onInitSchema(schema, className) {}
  onInitDefinition(definition, className) {}

  onInitClass(Class, className) {}

  onParseDefinition(definition, className) {}
  onApplyDefinition(Class, definition, className) {}
  onMergeDefinitions(targetDefinition, sourceDefinition, className) {}
};