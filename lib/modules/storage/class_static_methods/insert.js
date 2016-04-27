import wrapCallback from '../utils/wrap_callback.js';
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
  // Wrap callback function.
  const wrappedCallback = wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {

    // Prepare meteor method name to be called.
    const methodName = '/Astronomy/insert';
    // Prepare meteor method options.
    const methodOptions = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run Meteor method.
      return callMeteorMethod(
        Class, methodName, [args], methodOptions, wrappedCallback
      );
    }
    // Catch stub exceptions.
    catch (error) {
      wrappedCallback(error);
    }

  }
  // If we can just insert a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  else {

    try {
      // Set the "trusted" argument to true.
      args.trusted = true;
      // Insert a document.
      return wrappedCallback(
        undefined,
        classInsert(args)
      );
    }
    catch (error) {
      wrappedCallback(error);
    }

  }
};

export default insert;