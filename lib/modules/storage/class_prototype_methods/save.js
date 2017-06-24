import defaults from 'lodash/defaults';
import each from 'lodash/each';
import extend from 'lodash/extend';
import { DDP } from 'meteor/ddp';
import documentInsert from '../utils/document_insert';
import documentUpdate from '../utils/document_update';
import isRemote from '../utils/is_remote';
import callMeteorMethod from '../utils/call_meteor_method';
import rawAll from '../../fields/utils/rawAll';
import castNested from '../../fields/utils/castNested';
import getModifier from '../../storage/utils/getModifier';

function save(options = {}, callback) {
  const doc = this;
  const Class = doc.constructor;
  const Collection = Class.getCollection();

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(options, Function)) {
    callback = options;
    options = {};
  }

  // Set default options.
  defaults(options, {
    stopOnFirstError: true,
    simulation: true
  });

  // Cast all fields.
  if (options.cast) {
    each(Class.getFields(), (field) => {
      doc[field.name] = field.castValue(doc[field.name], {
        clone: false,
        cast: true
      });
    });
  }
  // Cast only nested fields.
  else {
    castNested({
      doc,
      options: {
        clone: false
      }
    });
  }

  // Detect which operation we are executing.
  const inserting = doc._isNew;

  // Generate ID if not provided.
  if (inserting && !doc._id) {
    let generateId = true;
    // Don't generate the id if we're the client and the 'outermost' call.
    // This optimization saves us passing both the randomSeed and the id.
    // Passing both is redundant.
    if (Collection._isRemoteCollection()) {
      const enclosing = DDP._CurrentInvocation.get();
      if (!enclosing) {
        generateId = false;
      }
    }
    if (generateId) {
      doc._id = Collection._makeNewID();
    }
  }

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    const methodName = '/Astronomy/' + (inserting ? 'insert' : 'update');
    // Prepare arguments for meteor method.
    const methodArgs = {
      className: Class.getName(),
      stopOnFirstError: options.stopOnFirstError,
      simulation: options.simulation,
    };
    // Inserting.
    if (inserting) {
      extend(methodArgs, {
        rawDoc: rawAll(doc, {
          transient: false
        })
      });
    }
    // Updating.
    else {
      extend(methodArgs, {
        selector: {
          _id: doc._id
        },
        modifier: getModifier({
          doc
        }),
        options: {},
        fields: options.fields
      });
    }

    try {
      // Run Meteor method.
      const result = callMeteorMethod(
        Class, methodName, [methodArgs], callback
      );
      if (result && inserting) {
        // In the insert operation the value return from the meteor method is
        // a document ID.
        doc._id = result;
      }
      // Document is not new anymore.
      doc._isNew = false;
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

  // If we can just insert a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  try {
    // Prepare arguments.
    let methodArgs = {
      doc,
      stopOnFirstError: options.stopOnFirstError,
      simulation: options.simulation,
      trusted: true
    };
    if (inserting) {
      let result = documentInsert(methodArgs);
      if (callback) {
        callback(undefined, result);
      }
      return result;
    }
    else {
      methodArgs.fields = options.fields;
      let result = documentUpdate(methodArgs);
      if (callback) {
        callback(undefined, result);
      }
      return result;
    }
  }
  catch (err) {
    if (callback) {
      callback(err);
      return null;
    }
    throw err;
  }
}

export default save;