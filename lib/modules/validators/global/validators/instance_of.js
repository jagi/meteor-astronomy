Validators.instanceOf = function(doc, fieldName, Class) {
  let fieldValue = doc.get(fieldName);

  if (!(fieldValue instanceof Class)) {
    throw new Meteor.Error('validation-error', 'Instance of', {
      fieldName: fieldName,
      fieldValue: fieldValue,
      validator: 'instanceOf',
      param: Class
    });
  }
};