const callMeteorMethod = (Class, methodName, methodArgs, callback) => {
  const Collection = Class.getCollection();
  let connection = Collection && Collection._connection;
  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection || Meteor.server;
  }
  // Prepare meteor method options.
  const methodOptions = {
    throwStubExceptions: true,
    returnStubValue: true
  };
  return connection.apply(methodName, methodArgs, methodOptions, callback);
};

export default callMeteorMethod;
