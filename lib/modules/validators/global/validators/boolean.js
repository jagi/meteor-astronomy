Validators.boolean = function(doc, fieldName) {
  let fieldValue = doc.get(fieldName);

  if (!_.isBoolean(fieldValue)) {
    let message = 'The "' + fieldName + '" field has to be a boolean';
    throw new Meteor.Error('validation', message, {
      fieldName: fieldName,
      fieldValue: fieldValue,
      validator: 'boolean'
    });
  }
};