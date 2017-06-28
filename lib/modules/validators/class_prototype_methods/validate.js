import _defaults from 'lodash/defaults';
import _each from 'lodash/each';
import castNested from '../../fields/utils/castNested';
import documentValidate from '../utils/document_validate';
import callMeteorMethod from '../../storage/utils/call_meteor_method';

function validate(options = {}, callback) {
  const doc = this;
  const Class = doc.constructor;
  const Collection = Class.getCollection();
  let connection = Collection && Collection._connection;
  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection;
  }

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(options, Function)) {
    callback = options;
    options = {};
  }

  // Set default options.
  _defaults(options, {
    fields: Class.getValidationOrder(),
    modified: false,
    stopOnFirstError: true,
    simulation: true
  });

  // If a fields property is a string then put it into array.
  if (Match.test(options.fields, String)) {
    options.fields = [options.fields];
  }

  // Cast all fields.
  if (options.cast) {
    _each(Class.getFields(), (field) => {
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

  // Prepare arguments for meteor method and utility.
  let methodArgs = {
    doc,
    fields: options.fields,
    modified: options.modified,
    stopOnFirstError: options.stopOnFirstError,
    simulation: options.simulation,
  };

  // If we are dealing with a remote collection and we are not on the server.
  if (connection && connection !== Meteor.server) {
    // Prepare arguments for meteor method.
    let methodName = '/Astronomy/validate';

    try {
      // Run Meteor method.
      return callMeteorMethod(
        Class, methodName, [methodArgs], callback
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

  // If we can just validate a document without calling the meteor method. We
  // may be on the server or the collection may be local.
  try {
    // Validate a document.
    let result = documentValidate(methodArgs);
    if (callback) {
      callback();
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

export default validate;