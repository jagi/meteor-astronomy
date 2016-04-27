import AstroClass from '../../../core/class.js';
import throwIfSelectorIsNotId from './throw_if_selector_is_not_id.js';
import documentRemove from './document_remove.js';

function classRemove(args = {}) {
  const {
    className,
    selector,
    simulation = true,
    trusted = false
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.
  if (!trusted) {
    throwIfSelectorIsNotId(selector, 'remove');
  }

  const Class = AstroClass.get(className);
  // Get all documents matching selector.
  const docs = Class.find(selector);
  // Prepare result of the method execution.
  let result = 0;

  docs.forEach((doc) => {
    // Update a document.
    result += documentRemove({
      doc,
      simulation,
      trusted
    });
  });

  return result;
};

export default classRemove;