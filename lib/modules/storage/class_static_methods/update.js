import wrapCallback from '../utils/wrap_callback.js';
import isRemote from '../utils/is_remote.js';
import callMeteorMethod from '../utils/call_meteor_method.js';
import classUpdate from '../utils/class_update.js';

function update(selector, modifier, options, callback) {
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
  // Wrap callback function.
  const wrappedCallback = wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {

    // Prepare meteor method name to be called.
    const methodName = '/Astronomy/update';
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
  // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  else {

    try {
      // Set the "trusted" argument to true.
      args.trusted = true;
      // Remove a document.
      return wrappedCallback(
        undefined,
        classUpdate(args)
      );
    }
    catch (error) {
      wrappedCallback(error);
    }

  }
};

export default update;