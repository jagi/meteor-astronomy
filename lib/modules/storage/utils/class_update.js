import _extend from 'lodash/extend';
import _mapKeys from 'lodash/mapKeys';
import AstroClass from '../../../core/class.js';
import alreadyInSimulation from './already_in_simulation.js';
import throwIfSelectorIsNotId from './throw_if_selector_is_not_id.js';
import documentUpdate from './document_update.js';
import applyModifier from './apply_modifier.js';
import { Minimongo } from 'meteor/minimongo';

function classUpdate(args = {}) {
  const {
    className,
    selector,
    modifier,
    options,
    stopOnFirstError,
    fields,
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
  if (!trusted && !alreadyInSimulation()) {
    throwIfSelectorIsNotId(selector, 'update');
  }

  const Class = AstroClass.get(className);
  // Get all documents matching selector.
  let docs;
  let oldDocs;
  if (options.multi) {
    docs = Class.find(selector, options);
    // Get all old documents in one batched query so that performance is
    // improved when updating many documents. Map all documents to an object
    // where properites are documents' IDs.
    oldDocs = _mapKeys(Class.find(selector, _extend(options, {
      defaults: false
    })).fetch(), oldDoc => oldDoc._id);
  }
  else {
    docs = Class.find(selector, _extend(options, {
      limit: 1
    }));
    // Get all old documents in one batched query so that performance is
    // improved when updating many documents. Map all documents to an object
    // where properites are documents' IDs.
    oldDocs = _mapKeys(Class.find(selector, _extend(options, {
      limit: 1,
      defaults: false
    })).fetch(), oldDoc => oldDoc._id);
  }

  // Create a minimongo matcher object to find array indexes on the projection
  // operator use.
  const matcher = new Minimongo.Matcher(selector);

  // Prepare result of the method execution.
  let result = 0;

  docs.forEach((doc) => {
    const oldDoc = oldDocs[doc._id];
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
      simulation,
      fields,
      trusted,
      oldDoc
    });
  });

  return result;
};

export default classUpdate;