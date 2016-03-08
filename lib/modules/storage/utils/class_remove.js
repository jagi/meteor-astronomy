import AstroClass from '../../../core/class.js';
import isEnvironment from '../../../core/utils/is_environment.js';
import throwIfSelectorIsNotId from './throw_if_selector_is_not_id.js';
import documentRemove from './document_remove.js';

function classRemove(args = {}) {
  let {
    className,
    selector,
    environment,
    trusted = false
  } = args;

  // Stop execution if we are not in a given environment.
  if (environment && !isEnvironment(environment)) {
    return;
  }

  // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.
  if (!trusted) {
    throwIfSelectorIsNotId(selector, 'remove');
  }

  let Class = AstroClass.get(className);
  let Collection = Class.getCollection();

  // Get all documents matching selector.
  let docs = Class.find(selector);

  // Prepare result of the method execution.
  let result = 0;

  docs.forEach((doc) => {
    // Update a document.
    result += documentRemove({
      doc,
      environment,
      trusted
    });
  });

  return result;
};

export default classRemove;