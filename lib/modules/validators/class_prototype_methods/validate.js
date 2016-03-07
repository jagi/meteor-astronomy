import castNested from '../../fields/utils/cast_nested.js';
import wrapCallback from '../../../core/utils/wrap_callback.js';
import documentValidate from '../utils/document_validate.js';

function validate(args = {}, callback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();
  let connection = Collection && Collection._connection;
  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection;
  }

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(args, Function)) {
    callback = args;
    args = {};
  }

  let {
    fields = Class.getValidationOrder(),
    stopOnFirstError = true,
    environment
  } = args;

  // If a fields property is a string then put it into array.
  if (Match.test(fields, String)) {
    fields = [fields];
  }

  // Cast nested documents.
  castNested(doc);

  // Wrap callback function.
  let wrappedCallback = wrapCallback(callback);
  // Prepare arguments for meteor method and utility.
  let methodArgs = {
    doc,
    fields,
    stopOnFirstError,
    environment
  };

  // If we are dealing with a remote collection and we are not on the server.
  if (connection && connection !== Meteor.server) {

    // Prepare arguments for meteor method.
    let methodName = '/Astronomy/validate';
    let methodOptions = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run Meteor method.
      connection.apply(
        methodName, [methodArgs], methodOptions, wrappedCallback
      );
    }
    // Catch stub exceptions.
    catch (error) {
      wrappedCallback(error);
    }

  }
  // If we can just validate a document without calling the meteor method. We
  // may be on the server or the collection may be local.
  else {

    try {
      // Validate a document.
      return wrappedCallback(
        undefined,
        documentValidate(methodArgs)
      );
    }
    catch (error) {
      wrappedCallback(error);
    }

  }
};

export default validate;