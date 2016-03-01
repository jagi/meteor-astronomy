import wrapCallback from '../../../core/utils/wrap_callback.js';
import classUpdate from '../utils/class_update.js';

function update(selector, modifier, options, callback) {
  let Class = this;
  let Collection = Class.getCollection();

  // If we omit options argument then it may be a callback function.
  if (options instanceof Function) {
    callback = options;
    options = {};
  }
  // Make sure that options is at least an empty object.
  options = options || {};
  // Prepare arguments.
  let args = {
    className: Class.getName(),
    selector,
    modifier,
    options,
    fields: Class.getValidationOrder(),
    stopOnFirstError: true
  };
  // Wrap callback function.
  let wrappedCallback = wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (Collection._connection && Collection._connection !== Meteor.server) {

    // Prepare meteor method name to be called.
    let methodName = '/Astronomy/update';
    // Prepare meteor method options.
    let methodOptions = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run Meteor method.
      return Collection._connection.apply(
        methodName, [args], methodOptions, wrappedCallback
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