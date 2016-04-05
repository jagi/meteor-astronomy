function onInitDefinition(definition, className) {
  definition.collection = undefined;
  definition.typeField = undefined;
  definition.transform = undefined;
  definition.secured = undefined;
};

export default onInitDefinition;