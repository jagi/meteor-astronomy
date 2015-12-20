Validators.array = function(doc, fieldName) {
  let fieldValue = doc.get(fieldName);

  if (!_.isArray(fieldValue)) {
    let message = 'The "' + fieldName + '" field has to be an array';
    throw new Meteor.Error('validation', message, {
      fieldName: fieldName,
      fieldValue: fieldValue,
      validator: 'array'
    });
  }
};