import _ from 'lodash';
import wrapMethodInMeteor from '../meteor_methods/wrapper.js';
import hasMeteorMethod from '../utils/has_meteor_method.js';

function onApplyDefinition(Class, parsedDefinition, className) {
    let schema = Class.schema;


    if (schema.collection) {

        const Collection = schema.collection;
        const connection = Collection._connection;

        if (!hasMeteorMethod(connection, "Astronomy/execute")) {
            //register a meteor Method that executes the actual Method in the context of the Object
            let methodDefinition = function (className, methodName, id, args) {
                let classInstance = global.Astro.Class.classes[className];
                //fetch the object
                let obj = classInstance.findOne({_id: id});

                //get the method
                let method = classInstance.schema._meteorMethods[methodName];

                if (typeof method !== "function")
                    throw new Meteor.Error("Illegal argument: ", methodName);

                //call the actual method
                return method.apply(obj, args);
            };


            // Add meteor method.
            connection.methods(_.zipObject(["Astronomy/execute"], [methodDefinition]));
        }

        // Add methods to the class.
        _.each(parsedDefinition.meteorMethods, (method, methodName) => {
            let wrappedMethod = wrapMethodInMeteor(connection, className, methodName, method);
            //if we are on the server we don't need to call Meteor methods
            schema._meteorMethods[methodName] = method;
            schema.meteorMethods[methodName] = wrappedMethod;
            Class.prototype[methodName] = wrappedMethod;

        });
    }
};

export default onApplyDefinition;