import _ from 'lodash';

function wrapMethodInMeteor(connection, className, methodName, method) {
   
    let wrapperFunction = function () {
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
                return connection.call("Astronomy/execute", className, methodName, this._id, args, callback);
            else
                return connection.call("Astronomy/execute", className, methodName, this._id, args);
        }

    };

    wrapperFunction.isMeteorMethod = true;

    return wrapperFunction;

}

export default wrapMethodInMeteor;