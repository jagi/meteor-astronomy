Astro.utils.fields.castNested = function(doc) {
  let Class = doc.constructor;
  let nestedFields = Class.getNestedFields();

  _.each(nestedFields, function(nestedField, nestedFieldName) {
    if (nestedField.count === 'one') {
      let NestedClass = nestedField.class;
      if (!(doc[nestedFieldName] instanceof NestedClass)) {
        doc[nestedFieldName] = new NestedClass(doc[nestedFieldName]);
      }
    } else if (nestedField.count === 'many' && nestedField.class) {
      let NestedClass = nestedField.class;
      _.each(doc[nestedFieldName], function(element, index) {
        if (!(element instanceof NestedClass)) {
          doc[nestedFieldName][index] = new NestedClass(element);
        }
      });
    }
  });
};