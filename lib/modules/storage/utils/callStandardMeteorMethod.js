function callStandardMeteorMethod(Class, methodName, methodArgs, callback) {
  const Collection = Class.getCollection();
  let connection = Collection && Collection._connection;
  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection || Meteor.server;
  }
  return connection.apply(methodName, methodArgs, callback);
}

export default callStandardMeteorMethod;
