import castNested from '../../fields/utils/cast_nested.js';
import wrapCallback from '../../../core/utils/wrap_callback.js';
import documentValidate from '../utils/document_validate.js';

function validate(options = {}, callback) {
  let doc = this;
  let Class = doc.constructor;

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(options, Function)) {
    callback = options;
    options = {};
  }

  let {
    fields = Class.getValidationOrder(),
    stopOnFirstError = true,
    environment
  } = options;

  // If a fields property is a string then put it into array.
  if (Match.test(fields, String)) {
    fields = [fields];
  }

  // Cast nested documents.
  castNested(doc);

  // Wrap callback function.
  let wrappedCallback = wrapCallback(callback);
  // Prepare arguments for meteor method and utility.
  let args = {
    doc,
    fields,
    stopOnFirstError,
    environment
  };

  // Not on the server.
  if (!Meteor.isServer) {

    // Prepare arguments for meteor method.
    let methodName = '/Astronomy/validate';
    let methodOptions = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run Meteor method.
      Meteor.apply(
        methodName, [args], methodOptions, wrappedCallback
      );
    }
    // Catch stub exceptions.
    catch (error) {
      wrappedCallback(error);
    }

  }
  // On the server.
  else {

    try {
      // Validate a document.
      return wrappedCallback(
        undefined,
        documentValidate(args)
      );
    }
    catch (error) {
      wrappedCallback(error);
    }

  }
};

export default validate;