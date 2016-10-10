import _ from 'lodash';
import wrapMethodInMeteor from '../meteor_methods/wrapper.js';
import hasMeteorMethod from '../utils/has_meteor_method.js';
import meteor_execute from "../meteor_methods/meteor_execute";

function onApplyDefinition(Class, parsedDefinition, className) {
    let schema = Class.schema;


    if (schema.collection) {

        const Collection = schema.collection;
        const connection = Collection._connection;

        if (!hasMeteorMethod(connection, "Astronomy/execute")) {
            //register a meteor Method that executes the actual Method in the context of the Object
            connection.methods(_.zipObject(["Astronomy/execute"], [meteor_execute]));
        }

        // Add methods to the class.
        _.each(parsedDefinition._meteorMethods, (method, methodName) => {
            let wrappedMethod = wrapMethodInMeteor(connection, className, methodName, method);

            if (!Class.prototype._meteorMethods)
                Class.prototype._meteorMethods = {};

            Class.prototype._meteorMethods[methodName] = method;
            schema._meteorMethods[methodName] = method;

            schema.meteorMethods[methodName] = wrappedMethod;
            Class.prototype[methodName] = wrappedMethod;

        });
    }
};

export default onApplyDefinition;