import _tail from 'lodash/tail';

function validateAll(rawDoc) {
  const Class = this;
  const doc = new Class(rawDoc);
  const args = _tail(arguments);
  return doc.validateAll.apply(doc, args);
};

export default validateAll;