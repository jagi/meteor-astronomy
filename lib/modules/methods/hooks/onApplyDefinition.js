import {
  zipObject,
  each
} from 'lodash';
import wrapMethod from '../utils/wrapMethod';
import hasMeteorMethod from '../../storage/utils/has_meteor_method';
import astronomyExecute from "../meteor_methods/astronomyExecute";
import applyMethod from "../class_prototype_methods/applyMethod";
import callMethod from "../class_prototype_methods/callMethod";

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
    each(parsedDefinition.meteorMethods, (method, methodName) => {
      schema.methods[methodName] = method;
      Class.prototype[methodName] = wrapMethod(methodName);
    });

    // Add universal "applyMethod" and "callMethod" methods that can invoke any
    // method even if only defined on the server.
    Class.prototype.applyMethod = applyMethod;
    Class.prototype.callMethod = callMethod;
  }
};

export default onApplyDefinition;