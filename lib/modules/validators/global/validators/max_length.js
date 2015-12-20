Validators.maxLength = function(doc, fieldName, maxLength) {
  let fieldValue = doc.get(fieldName);

  if (fieldValue.length > maxLength) {
    throw new Meteor.Error('validation', 'Max length', {
      fieldName: fieldName,
      fieldValue: fieldValue,
      validator: 'maxLength',
      param: maxLength
    });
  }
};