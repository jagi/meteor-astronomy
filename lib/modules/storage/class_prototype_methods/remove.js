import documentRemove from '../utils/document_remove.js';
import isRemote from '../utils/is_remote.js';
import callMeteorMethod from '../utils/call_meteor_method.js';

function remove(args = {}, callback) {
  let doc = this;
  let Class = doc.constructor;

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(args, Function)) {
    callback = args;
    args = {};
  }
  // Get variables from the first argument.
  let {
    simulation = true
  } = args;

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    let methodName = '/Astronomy/remove';
    // Prepare arguments for the meteor method.
    let methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      simulation
    };

    try {
      // Run meteor method.
      let result = callMeteorMethod(
        Class, methodName, [methodArgs], callback
      );
      // Change the "_isNew" flag to "true". After removing a document can be
      // saved again as a new one.
      doc._isNew = true;
      // Return result of the meteor method call.
      return result;
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
    // Prepare arguments.
    let methodArgs = {
      doc,
      simulation,
      trusted: true
    };
    let result = documentRemove(methodArgs);
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

export default remove;