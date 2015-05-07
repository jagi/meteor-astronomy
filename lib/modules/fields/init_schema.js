fieldsInitSchema = function(Class, definition) {
  // Check if fields definition is provided.
  if (!_.has(definition, 'fields')) {
    throw new Error('The fields definition has to be provided');
  }
  if (_.size(definition.fields) === 0) {
    throw new Error('At least one field has to be defined');
  }

  // Add private "_fields" attribute.
  this._fields = {};

  // Add mandatory "_id" field.
  this.addField('_id', {
    type: 'string',
    default: undefined
  });

  if (this.getParentClass()) {
    // Add field for storing child class name.
    this.addField('_type', {
      type: 'string',
      default: this.getName()
    });
  }

  // Add fields from class schema definition.
  this.addFields(definition.fields);
};
