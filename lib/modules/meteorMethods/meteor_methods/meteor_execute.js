import _ from 'lodash';

function meteor_execute(className, methodName, id, args) {
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

export default meteor_execute;