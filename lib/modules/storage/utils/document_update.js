import {
  size
}
from 'lodash';
import castNested from '../../fields/utils/castNested';
import triggerBeforeSave from './trigger_before_save';
import triggerBeforeUpdate from './trigger_before_update';
import triggerAfterSave from './trigger_after_save';
import triggerAfterUpdate from './trigger_after_update';
import isModified from './isModified';
import getModifier from './getModifier';
import documentValidate from '../../validators/utils/document_validate';

function documentUpdate(args = {}) {
  let {
    doc,
    stopOnFirstError,
    fields,
    simulation = true,
    trusted = false,
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Return if there were no modifications.
  if (!isModified({
      doc,
      fields
    })) {
    // Validate a document even if there were no modifications.
    documentValidate({
      doc,
      fields,
      stopOnFirstError,
      simulation
    });
    // 0 documents were modified.
    return 0;
  }

  // Check if a class is secured.
  if (Class.isSecured('update') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Updating from the client is not allowed');
  }

  // Cast nested documents.
  castNested({
    doc,
    options: {
      clone: false
    }
  });

  // Trigger before events.
  triggerBeforeSave(doc, trusted);
  triggerBeforeUpdate(doc, trusted);

  // Cast nested documents.
  castNested({
    doc,
    options: {
      clone: false
    }
  });

  // Validate a document.
  documentValidate({
    doc,
    fields,
    stopOnFirstError,
    simulation
  });

  // Get modifier.
  const modifier = getModifier({
    doc,
    fields
  });
  // Stop execution is a modifier is empty.
  if (size(modifier) === 0) {
    return 0;
  }
  // Update a document.
  try {
    const result = Collection._collection.update({
      _id: doc._id
    }, modifier);

    // Trigger after events.
    triggerAfterUpdate(doc, trusted);
    triggerAfterSave(doc, trusted);

    return result;
  }
  catch(err) {
    if (err.name === 'MongoError' || err.name === 'MinimongoError') {
      throw new Meteor.Error(409, err.toString());
    }
    else {
      throw err;
    }
  }
};

export default documentUpdate;
