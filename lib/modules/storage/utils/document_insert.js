import _ from 'lodash';
import castNested from '../../fields/utils/cast_nested.js';
import rawAll from '../../fields/utils/raw_all.js';
import triggerBeforeSave from './trigger_before_save.js';
import triggerBeforeInsert from './trigger_before_insert.js';
import triggerAfterSave from './trigger_after_save.js';
import triggerAfterInsert from './trigger_after_insert.js';
import documentValidate from '../../validators/utils/document_validate.js';

function documentInsert(args = {}) {
  let {
    doc,
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

  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Generate ID if not provided.
  if (!doc._id) {
    doc._id = Collection._makeNewID();
  }

  // Check if a class is secured.
  if (Class.isSecured('insert') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Inserting from the client is not allowed');
  }

  // Trigger before events.
  triggerBeforeSave(doc, trusted);
  triggerBeforeInsert(doc, trusted);

  // Cast nested documents.
  castNested({
    doc
  });

  // Validate a document.
  documentValidate({
    doc,
    fields,
    stopOnFirstError,
    simulation
  });

  // Get plain values of all fields. Pick only values that we want to save.
  let values = rawAll(doc, {
    transient: false
  });
  values = _.omitBy(values, _.isUndefined);
  // Insert a document.
  try {
    // There is a difference in what the insert method returns depending on the
    // environment. On the client it returns an inserted document id, on the
    // server it returns array of inserted documents. So we always return the
    // generated id. We can't send an entire document because it could be a
    // security issue if we are not subscribed to all fields of a document.
    const result = Collection._collection.insert(values);

    // Change the "_isNew" flag to "false". Now a document is not new.
    doc._isNew = false;

    // Trigger after events.
    triggerAfterInsert(doc, trusted);
    triggerAfterSave(doc, trusted);

    return doc._id;
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

export default documentInsert;