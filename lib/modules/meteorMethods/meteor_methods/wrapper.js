import _ from 'lodash';
import hasMeteorMethod from '../utils/has_meteor_method.js';

function wrapMethodInMeteor(connection, className, methodName, method) {
    let meteorMethodName = "Astronomy/" + className + "/" + methodName;

    //register a meteor Method that executes the actual Method in the context of the Object
    let methodDefinition = function (id, args) {
        let classInstance = global.Astro.Class.classes[className];
        //fetch the object
        let obj = classInstance.findOne({_id: id});

        //call the actual method
        return method.apply(obj, args);
    };

    if (!hasMeteorMethod(connection, meteorMethodName)) {
        // Add meteor method.
        connection.methods(_.zipObject([meteorMethodName], [methodDefinition]));
    }

    return function () {
        let args = Array.from(arguments);
        let callback;

        if (args.length && typeof args[args.length - 1] === "function")
            callback = args.pop();


        //Run this method locally on the object since we have to save it afterwards anyway
        if (!this._id || this._isNew) {
            if (callback) {
                try {
                    callback(undefined, method.apply(this, args));
                } catch (ex) {
                    callback(ex)
                }
            }
            else {
                return method.apply(this, args);
            }
        } else {
            if (callback)
                return connection.call(meteorMethodName, this._id, args, callback);
            else
                return connection.call(meteorMethodName, this._id, args);
        }

    };

}

export default wrapMethodInMeteor;