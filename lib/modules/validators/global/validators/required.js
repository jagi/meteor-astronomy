Validators.required = function(doc, fieldName) {
  let fieldValue = doc.get(fieldName);
  if (fieldValue === null) {
    let message = 'The "' + fieldName + '" field is required';
    throw new Meteor.Error('validation', message, {
      fieldName: fieldName,
      fieldValue: fieldValue,
      validator: 'required'
    });
  }
};