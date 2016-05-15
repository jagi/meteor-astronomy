function onInitSchema(schema, className) {
  schema.collection = undefined;
  schema.typeField = undefined;
  schema.transform = undefined;
  schema.secured = {
    common: true
  };
};

export default onInitSchema;