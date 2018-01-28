import _defaults from 'lodash/defaults';
import _each from 'lodash/each';

function getFieldsNames(options = {}) {
  // Prepare options.
  _defaults(options, {
    transient: true,
    immutable: true
  });

  const fieldsNames = [];
  _each(this.schema.fields, (field, name) => {
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