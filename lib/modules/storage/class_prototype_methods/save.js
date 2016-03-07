import documentInsert from '../utils/document_insert.js';
import documentUpdate from '../utils/document_update.js';
import wrapCallback from '../../../core/utils/wrap_callback.js';
import rawAll from '../../fields/utils/raw_all.js';
import castNested from '../../fields/utils/cast_nested.js';
import getModifier from '../../storage/utils/get_modifier.js';

function save(args = {}, callback) {
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
    stopOnFirstError = true,
    environment
  } = args;

  // Cast nested documents.
  castNested(doc);

  // Wrap callback function.
  let wrappedCallback = wrapCallback(callback);
  // Detect which operation we are executing.
  let inserting = doc._isNew;

  // If we are dealing with a remote collection and we are not on the server.
  if (connection && connection !== Meteor.server) {

    // Prepare meteor method name to be called.
    let methodName = '/Astronomy/' + (inserting ? 'insert' : 'update');
    // Prepare arguments for meteor method.
    let methodArgs = {
      className: Class.getName(),
      stopOnFirstError,
      environment
    };
    // Inserting.
    if (inserting) {
      methodArgs.plainDoc = rawAll(doc, {
        transient: false
      });
    }
    // Updating.
    else {
      methodArgs.selector = {
        _id: doc._id
      };
      methodArgs.modifier = getModifier({
        doc
      });
      methodArgs.options = {};
    }
    // Prepare meteor method options.
    let methodOptions = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run Meteor method.
      let result = connection.apply(
        methodName, [methodArgs], methodOptions, wrappedCallback
      );
      // In the insert operation a value returned from the method call is a
      // document ID.
      if (inserting) {
        doc._id = result;
      }
      // Document is not new anymore.
      doc._isNew = false;
      // Return result of the meteor method call.
      return result;
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
      // Prepare arguments.
      let methodArgs = {
        doc,
        stopOnFirstError,
        environment,
        trusted: true
      };
      return wrappedCallback(
        undefined,
        inserting ? documentInsert(methodArgs) : documentUpdate(methodArgs)
      );
    }
    catch (error) {
      wrappedCallback(error);
    }

  }
};

export default save;