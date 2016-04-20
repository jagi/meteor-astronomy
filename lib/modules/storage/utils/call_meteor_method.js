function callMeteorMethod(
  Class, methodName, methodArgs, methodOptions, wrappedCallback
) {
  const Collection = Class.getCollection();
  let connection = Collection && Collection._connection;
  if (!connection && (!Collection || !Collection._name)) {
    connection = Meteor.connection;
  }

  return connection.apply(
    methodName, methodArgs, methodOptions, wrappedCallback
  );
}

export default callMeteorMethod;