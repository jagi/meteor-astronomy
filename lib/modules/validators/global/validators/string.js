Validators.string = function(doc, fieldName) {
  let fieldValue = doc.get(fieldName);

  if (!_.isString(fieldValue)) {
    let message = 'The "' + fieldName + '" field has to be a string';
    throw new Meteor.Error('validation-error', message, {
      fieldName: fieldName,
      fieldValue: fieldValue,
      validator: 'string'
    });
  }
};