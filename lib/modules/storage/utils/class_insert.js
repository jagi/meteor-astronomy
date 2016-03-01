import AstroClass from '../../../core/class.js';
import isEnvironment from '../../../core/utils/is_environment.js';
import documentInsert from './document_insert.js';

function classInsert(args = {}) {
  let {
    className,
    plainDoc,
    fields,
    stopOnFirstError = true,
    environment,
    trusted = false,
  } = args;

  // Stop execution if utility executed in not allowed environment.
  if (!isEnvironment(environment)) {
    return;
  }

  let Class = AstroClass.get(className);
  let Collection = Class.getCollection();

  // Create a new document.
  let doc = new Class(plainDoc);

  // Insert a document.
  return documentInsert({
    doc,
    fields,
    stopOnFirstError,
    environment,
    trusted,
  });
};

export default classInsert;