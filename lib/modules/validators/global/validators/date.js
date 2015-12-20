Validators.date = function(doc, fieldName) {
  let fieldValue = doc.get(fieldName);

  if (!_.isDate(fieldValue)) {
    let message = 'The "' + fieldName + '" field has to be a date';
    throw new Meteor.Error('validation', message, {
      fieldName: fieldName,
      fieldValue: fieldValue,
      validator: 'date'
    });
  }
};