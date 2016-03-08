import isEnvironment from '../../../core/utils/is_environment.js';
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
    stopOnFirstError = true,
    environment,
    trusted = false
  } = args;

  // Stop execution if we are not in a given environment.
  if (environment && !isEnvironment(environment)) {
    return;
  }

  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Generate ID if not provided.
  if (!doc._id) {
    doc._id = Collection._makeNewID();
  }

  // Trigger before events.
  triggerBeforeSave(doc, trusted);
  triggerBeforeInsert(doc, trusted);

  // Cast nested documents.
  castNested(doc);

  // Validate a document.
  documentValidate({
    doc,
    fields: Class.getValidationOrder(),
    stopOnFirstError,
    environment
  });

  // Get plain values of all fields. Pick only values that we want to save.
  let values = rawAll(doc, {
    transient: false
  });
  // Insert a document.
  Collection._collection.insert(values);
  // There is a difference in what the insert method returns depending on the
  // environment. On the client it returns an inserted document id, on the
  // server it returns array of inserted documents. So we always return the
  // generated id. We can't send an entire document because it could be a
  // security issue if we are not subscribed to all fields of a document.
  let result = doc._id;
  // Change the "_isNew" flag to "false". Now a document is not new.
  doc._isNew = false;

  // Trigger after events.
  triggerAfterInsert(doc, trusted);
  triggerAfterSave(doc, trusted);

  return result;
};

export default documentInsert;