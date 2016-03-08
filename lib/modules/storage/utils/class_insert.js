import AstroClass from '../../../core/class.js';
import isEnvironment from '../../../core/utils/is_environment.js';
import documentInsert from './document_insert.js';

function classInsert(args = {}) {
  let {
    className,
    plainDoc,
    stopOnFirstError = true,
    environment,
    trusted = false,
  } = args;

  // Stop execution if we are not in a given environment.
  if (environment && !isEnvironment(environment)) {
    return;
  }

  let Class = AstroClass.get(className);
  let Collection = Class.getCollection();

  // Create a new document.
  let doc = new Class(plainDoc);

  // Insert a document.
  return documentInsert({
    doc,
    stopOnFirstError,
    environment,
    trusted,
  });
};

export default classInsert;