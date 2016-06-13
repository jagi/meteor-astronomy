import isRemote from '../utils/is_remote.js';
import callMeteorMethod from '../utils/call_meteor_method.js';
import classInsert from '../utils/class_insert.js';

function insert(plainDoc, callback) {
  const Class = this;

  // Prepare arguments.
  const args = {
    className: Class.getName(),
    plainDoc
  };

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