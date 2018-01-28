import _each from 'lodash/each';
import _zipObject from 'lodash/zipObject';
import hasMeteorMethod from '../../storage/utils/has_meteor_method.js';
import meteorValidate from '../meteor_methods/validate.js';

function onApplyDefinition(Class, parsedDefinition, className) {
  _each(parsedDefinition.validators, function(validators, fieldName) {
    Class.schema.validators[fieldName] =
      Class.schema.validators[fieldName] || [];
    _each(validators, function(validator) {
      Class.schema.validators[fieldName] =
        Class.schema.validators[fieldName].concat(validator);
    });
  });

  // Add the "/Astronomy/validate" meteor method only when a class has assigned
  // collection.
  let Collection = Class.getCollection();
  // If it's a remote collection then we register methods on the connection
  // object of the collection.
  let connection = Collection && Collection._connection;
  // If it's not a remote collection than use main Meteor connection.
  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection || Meteor.server;
  }
  if (connection) {
    // Prepare meteor methods to be added.
    let meteorMethods = {
      '/Astronomy/validate': meteorValidate
    };
    _each(meteorMethods, (meteorMethod, methodName) => {
      if (!hasMeteorMethod(connection, methodName)) {
        // Add meteor method.
        connection.methods(_zipObject([methodName], [meteorMethod]));
      }
    });
  }

  Class.schema.resolveError = parsedDefinition.resolveError;
};

export default onApplyDefinition;