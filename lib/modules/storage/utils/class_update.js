import AstroClass from '../../../core/class.js';
import isEnvironment from '../../../core/utils/is_environment.js';
import throwIfSelectorIsNotId from './throw_if_selector_is_not_id.js';
import documentUpdate from './document_update.js';
import applyModifier from './apply_modifier.js';
import { Minimongo }
from 'meteor/minimongo';

function classUpdate(args = {}) {
  let {
    className,
    selector,
    modifier,
    options,
    stopOnFirstError,
    environment,
    trusted = false,
  } = args;

  // Stop execution if we are not in a given environment.
  if (environment && !isEnvironment(environment)) {
    return;
  }

  // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.
  if (!trusted) {
    throwIfSelectorIsNotId(selector, 'update');
  }

  let Class = AstroClass.get(className);
  let Collection = Class.getCollection();

  // Get all documents matching selector.
  let docs;
  if (options.multi) {
    docs = Class.find(selector);
  }
  else {
    docs = Class.find(selector, {
      limit: 1
    });
  }

  // Create a minimongo matcher object to find array indexes on the projection
  // operator use.
  let matcher = new Minimongo.Matcher(selector);

  // Prepare result of the method execution.
  let result = 0;

  docs.forEach((doc) => {
    // Use matcher to find array indexes in a given document that needs updating
    // on the projection operator use.
    let queryResult = matcher.documentMatches(doc);

    // Apply modifier.
    applyModifier({
      doc,
      modifier,
      options: queryResult.arrayIndices ? {
        arrayIndices: queryResult.arrayIndices
      } : {}
    });

    // Update a document.
    result += documentUpdate({
      doc,
      stopOnFirstError,
      environment,
      trusted
    });
  });

  return result;
};

export default classUpdate;