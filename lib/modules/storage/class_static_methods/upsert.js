import isRemote from '../utils/is_remote.js';
import callMeteorMethod from '../utils/call_meteor_method.js';
import classUpsert from '../utils/class_upsert.js';

function upsert(selector, modifier, options, callback) {
  const Class = this;

  // If we omit options argument then it may be a callback function.
  if (options instanceof Function) {
    callback = options;
    options = {};
  }
  // Make sure that options is at least an empty object.
  options = options || {};
  // Prepare arguments.
  const args = {
    className: Class.getName(),
    selector,
    modifier,
    options
  };

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    const methodName = '/Astronomy/upsert';

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

  // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  try {
    // Set the "trusted" argument to true.
    args.trusted = true;
    // Remove a document.
    let result = classUpsert(args);
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

export default upsert;