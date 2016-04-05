function callMeteorMethod(
  Class, methodName, methodArgs, methodOptions, wrappedCallback
) {
  const Collection = Class.getCollection();
  if (!Collection) {
    return;
  }
  const connection = Collection._connection;

  return connection.apply(
    methodName, methodArgs, methodOptions, wrappedCallback
  );
}

export default callMeteorMethod;