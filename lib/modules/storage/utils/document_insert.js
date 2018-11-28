import _omitBy from 'lodash/omitBy';
import castNested from '../../fields/utils/castNested';
import rawAll from '../../fields/utils/rawAll';
import triggerBeforeSave from './trigger_before_save';
import triggerBeforeInsert from './trigger_before_insert';
import triggerAfterSave from './trigger_after_save';
import triggerAfterInsert from './trigger_after_insert';
import documentValidate from '../../validators/utils/document_validate';

function documentInsert(args = {}) {
  const {
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

  const Class = doc.constructor;
  const Collection = Class.getCollection();

  // Generate ID if not provided.
  if (!doc._id) {
    doc._id = Collection._makeNewID();
  }

  // Check if a class is secured.
  if (Class.isSecured('insert') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Inserting from the client is not allowed');
  }

  // Cast nested documents.
  castNested({
    doc,
    options: {
      clone: false
    }
  });

  // Trigger before events.
  triggerBeforeSave(args);
  triggerBeforeInsert(args);

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

  // Get plain values of all fields. Pick only values that we want to save.
  let values = rawAll(doc, {
    transient: false
  });
  values = _omitBy(values, (value) => value === undefined);

  // Insert a document.
  try {
    // There is a difference in what the insert method returns depending on the
    // environment. On the client it returns an inserted document id, on the
    // server it returns array of inserted documents. So we always return the
    // generated id. We can't send an entire document because it could be a
    // security issue if we are not subscribed to all fields of a document.
    Collection._collection.insert(values);

    // Change the "_isNew" flag to "false". Mark a document as not new.
    doc._isNew = false;

    // Trigger after events.
    triggerAfterInsert(args);
    triggerAfterSave(args);

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
