let methods = Astro.Module.modules.storage.classStaticMethods;

methods.insert = function() {
  let Class = this;
  let Collection = Class.getCollection();

  // Get arguments.
  let values = arguments[0];
  let userCallback = arguments[1];

  // Prepare arguments for Meteor method.
  let meteorMethodName =
    '/Astronomy/' + Class.getName() + '/classInsert';
  let meteorMethodOptions = {
    throwStubExceptions: true,
    returnStubValue: true
  };
  let args = [
    Class.getName(),
    values
  ];

  // Prepare callback function.
  let callback = Astro.utils.storage.generateMeteorMethodCallback(
    meteorMethodName, userCallback
  );

  try {
    // Run Meteor method.
    return Collection._connection.apply(
      meteorMethodName, args, meteorMethodOptions, callback
    );
  }
  catch(error) {
    callback(error);
  }
};