import documentRemove from '../utils/document_remove.js';
import wrapCallback from '../../../core/utils/wrap_callback.js';

function remove(args = {}, callback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();
  let connection = Collection._connection;

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(args, Function)) {
    callback = args;
    args = {};
  }
  // Get variables from the first argument.
  let {
    environment
  } = args;
  // Wrap callback function.
  let wrappedCallback = wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (connection && connection !== Meteor.server) {

    // Prepare meteor method name to be called.
    let methodName = '/Astronomy/remove';
    // Prepare arguments for the meteor method.
    let methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      environment
    };
    // Prepare meteor method options.
    let methodOptions = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run meteor method.
      let result = connection.apply(
        methodName, [methodArgs], methodOptions, wrappedCallback
      );
      // Change the "_isNew" flag to "true". After removing a document can be
      // saved again as a new one.
      doc._isNew = true;
      // Return result of the meteor method call.
      return result;
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
      // Prepare arguments.
      let methodArgs = {
        doc,
        environment,
        trusted: true
      };
      return wrappedCallback(
        undefined,
        documentRemove(methodArgs)
      );
    }
    catch (error) {
      wrappedCallback(error);
    }

  }
};

export default remove;