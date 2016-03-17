function getFieldsNames(options) {
  // Prepare options.
	options = _.extend({
		transient: true,
		immutable: true
	}, options);

  const fieldsNames = [];
  _.each(this.schema.fields, (field, name) => {
    // Don't get a transient field.
    if (!options.transient && field.transient) {
      return;
    }
    // Don't get an immutable field.
    if (!options.immutable && field.immutable) {
      return;
    }
    fieldsNames.push(name);
  });

	return fieldsNames;
};

export default getFieldsNames;