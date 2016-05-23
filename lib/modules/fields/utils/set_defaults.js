import _ from 'lodash';

function setDefaults(args = {}) {
  const {
    doc
  } = args;
  const Class = doc.constructor;

  _.each(Class.getFields(), (field) => {
    const value = doc[field.name];
    if (value === undefined) {
      doc[field.name] = field.getDefault();
    }
  });
}

export default setDefaults;