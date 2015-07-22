Astro.drivers = {};

Astro.registerDriver = function(driverName) {
  Astro.drivers[driverName] = {};
};

Astro.getDriver = function(driverName) {
  if (_.isUndefined(driverName)) {
    if (!_.isString(Astro.config.defaultDriver)) {
      throw new Error('There is no default driver');
    }

    driverName = Astro.config.defaultDriver;
  }

  if (!_.has(Astro.drivers, driverName)) {
    throw new Error(
      'There is no driver named "' + Astro.config.defaultDriver + '"'
    );
  }

  return Astro.drivers[driverName];
};
