import {
  zipObject,
  each
} from 'lodash';
import wrapMethod from '../utils/wrapMethod.js';
import hasMeteorMethod from '../../storage/utils/has_meteor_method.js';
import astronomyExecute from "../meteor_methods/astronomyExecute";

function onApplyDefinition(Class, parsedDefinition, className) {
  const schema = Class.schema;

  if (schema.collection) {
    const Collection = schema.collection;
    const connection = Collection._connection;

    // Prepare meteor methods to be added.
    const astroMethods = {
      '/Astronomy/execute': astronomyExecute,
    };
    each(astroMethods, (astroMethod, astroMethodName) => {
      if (!hasMeteorMethod(connection, astroMethodName)) {
        // Add Meteor method.
        connection.methods(zipObject([astroMethodName], [astroMethod]));
      }
    });

    // Add Meteor methods to the class.
    each(parsedDefinition.meteorMethods, (meteorMethod, meteorMethodName) => {
      schema.meteorMethods[meteorMethodName] = meteorMethod;
      Class.prototype[meteorMethodName] = wrapMethod(meteorMethodName);
    });
  }
};

export default onApplyDefinition;