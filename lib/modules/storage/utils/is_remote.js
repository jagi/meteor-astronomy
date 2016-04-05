function isRemote(Class) {
  const Collection = Class.getCollection();
  if (!Collection) {
    return false;
  }
  const connection = Collection._connection;

  return connection && connection !== Meteor.server;
}

export default isRemote;