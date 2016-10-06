import _ from 'lodash';
import wrapMethodInMeteor from '../meteor_methods/wrapper.js';

function onApplyDefinition(Class, parsedDefinition, className) {
    let schema = Class.schema;

    if (schema.collection) {
        const Collection = schema.collection;
        const connection = Collection._connection;

        // Add methods to the class.
        _.each(parsedDefinition.meteorMethods, (method, methodName) => {
            let wrappedMethod = wrapMethodInMeteor(connection, className, methodName, method);

            schema.meteorMethods[methodName] = wrappedMethod;
            Class.prototype[methodName] = wrappedMethod;
        });
    }
};

export default onApplyDefinition;