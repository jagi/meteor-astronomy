function isEnvironment(environment) {
  if (environment === 'client' && !Meteor.isClient) {
    return false;
  }
  else if (environment === 'server' && !Meteor.isServer) {
    return false;
  }
  return true;
};

export default isEnvironment;