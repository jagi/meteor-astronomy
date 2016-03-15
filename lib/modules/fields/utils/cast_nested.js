function castNested(doc) {
  let Class = doc.constructor;

  _.each(Class.getObjectFields(), (field) => {
    let value = doc[field.name];
    // If field value is empty then go to the next one.
    if (_.isNil(value)) {
      return;
    }
    let NestedClass = field.type.class;
    if (!(value instanceof NestedClass)) {
      if (!_.isPlainObject(value)) {
        return;
      }
      doc[field.name] = new NestedClass(value);
    }
  });

  _.each(Class.getListFields(), (field) => {
    let value = doc[field.name];
    // If field value is empty then go to the next one.
    if (_.isNil(value) || !_.isArray(value) || !field.isClass) {
      return;
    }
    let NestedClass = field.type.class;
    _.each(value, (element, index) => {
      if (!(element instanceof NestedClass)) {
        if (!_.isPlainObject(element)) {
          return;
        }
        value[index] = new NestedClass(element);
      }
    });
  });
};

export default castNested;