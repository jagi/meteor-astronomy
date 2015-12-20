Validators.number = function(doc, fieldName) {
  let fieldValue = doc.get(fieldName);

  if (!_.isNumber(fieldValue)) {
    let message = 'The "' + fieldName + '" field has to be a number';
    throw new Meteor.Error('validation', message, {
      fieldName: fieldName,
      fieldValue: fieldValue,
      validator: 'number'
    });
  }
};