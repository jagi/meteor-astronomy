function onInitSchema(schema, className) {
  schema.collection = undefined;
  schema.typeField = undefined;
  schema.transform = undefined;
  schema.secured = {
    common: false
  };
};

export default onInitSchema;
