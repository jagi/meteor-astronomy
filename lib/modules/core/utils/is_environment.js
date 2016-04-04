let environment;
if (Meteor.isClient) {
  environment = 'client';
}
else if (Meteor.isServer) {
  environment = 'server';
}
else if (Meteor.isCordova) {
  environment = 'cordova';
}

function isEnvironment(environments) {
  // Make sure that argument is an array.
  if (Match.test(environments, String)) {
    environments = [environments];
  }

  return _.includes(environments, environment);
};

export default isEnvironment;