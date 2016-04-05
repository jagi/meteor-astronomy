function onInitSchema(schema, className) {
  schema.collection = undefined;
  schema.typeField = undefined;
  schema.transform = undefined;
  schema.secured = {
    insert: true,
    update: true,
    remove: true
  };
};

export default onInitSchema;