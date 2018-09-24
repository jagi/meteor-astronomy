import _zipObject from "lodash/zipObject";
import _each from "lodash/each";
import wrapMethod from "../utils/wrapMethod";
import hasMeteorMethod from "../../storage/utils/has_meteor_method";
import astronomyExecute from "../meteor_methods/astronomyExecute";
import applyMethod from "../class_prototype_methods/applyMethod";
import callMethod from "../class_prototype_methods/callMethod";

function onFinalizeClass(Class, className) {
  const schema = Class.schema;

  if (schema.collection) {
    const Collection = schema.collection;
    const connection =
      Collection._connection || Meteor.connection || Meteor.server;
    if (connection) {
      if (!hasMeteorMethod(connection, "/Astronomy/execute")) {
        // Add Meteor method.
        connection.methods({
          "/Astronomy/execute": astronomyExecute
        });
      }
    }

    // Add Meteor methods to the class.
    _each(schema.methods, (method, methodName) => {
      Class.prototype[methodName] = wrapMethod(methodName);
    });

    // Add universal "applyMethod" and "callMethod" methods that can invoke any
    // method even if only defined on the server.
    Class.prototype.applyMethod = applyMethod;
    Class.prototype.callMethod = callMethod;
  }
}

export default onFinalizeClass;
