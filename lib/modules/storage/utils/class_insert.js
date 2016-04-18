import AstroClass from '../../../core/class.js';
import documentInsert from './document_insert.js';

function classInsert(args = {}) {
  let {
    className,
    plainDoc,
    stopOnFirstError = true,
    simulation = true,
    trusted = false,
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  let Class = AstroClass.get(className);
  // Create a new document.
  let doc = new Class(plainDoc);

  // Insert a document.
  return documentInsert({
    doc,
    stopOnFirstError,
    simulation,
    trusted,
  });
};

export default classInsert;