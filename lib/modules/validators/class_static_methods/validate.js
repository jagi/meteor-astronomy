import tail from 'lodash/tail';

function validate(rawDoc) {
  const Class = this;
  const doc = new Class(rawDoc);
  const args = tail(arguments);
  return doc.validate.apply(doc, args);
};

export default validate;