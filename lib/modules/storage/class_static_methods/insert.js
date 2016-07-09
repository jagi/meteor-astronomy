import isRemote from '../utils/is_remote.js';
import callMeteorMethod from '../utils/call_meteor_method.js';
import classInsert from '../utils/class_insert.js';

function insert(rawDoc, callback) {
  const Class = this;
  const Collection = Class.getCollection();

  // Prepare arguments.
  const args = {
    className: Class.getName(),
    rawDoc
  };

  // Generate ID if not provided.
  if (!rawDoc._id) {
    let generateId = true;
    // Don't generate the id if we're the client and the 'outermost' call.
    // This optimization saves us passing both the randomSeed and the id.
    // Passing both is redundant.
    if (Collection._isRemoteCollection()) {
      const enclosing = DDP._CurrentInvocation.get();
      if (!enclosing) {
        generateId = false;
      }
    }
    if (generateId) {
      rawDoc._id = Collection._makeNewID();
    }
  }

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    const methodName = '/Astronomy/insert';

    try {
      // Run Meteor method.
      return callMeteorMethod(
        Class, methodName, [args], callback
      );
    }
    // Catch stub exceptions.
    catch (err) {
      if (callback) {
        callback(err);
        return null;
      }
      throw err;
    }
  }

  // If we can just insert a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  try {
    // Set the "trusted" argument to true.
    args.trusted = true;
    // Insert a document.
    let result = classInsert(args);
    if (callback) {
      callback(undefined, result);
    }
    return result;
  }
  catch (err) {
    if (callback) {
      callback(err);
      return null;
    }
    throw err;
  }
}

export default insert;