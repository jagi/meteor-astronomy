var prototype = Astronomy.Schema.prototype;

prototype.getValidator = function(fieldName) {
  if (!_.isString(fieldName)) {
    return;
  }

  return this._validators[fieldName];
};

prototype.getValidators = function() {
  return this._validators;
};

prototype.addValidator = function(validatorData) {
  // We have to make sure that all the necessary data is provided. Later, when
  // validating field value, we shouldn't think about checking whether user
  // provided all the data. It's why we are doing it here.

  // Check if validator data is an object.
  if (!_.isObject(validatorData)) {
    throw new Error(
      'The validator data in `' + this.getName() +
      '` class schema has to be an object'
    );
  }

  // Check if validator type has been provided.
  if (!_.has(validatorData, 'type')) {
    throw new Error(
      'The validator type in `' + this.getName() +
      '` class schema can not be empty'
    );
  }

  // Check whether given validator type exists.
  if (!_.has(Validators, validatorData.type)) {
    throw new Error(
      'The `' + validatorData.type + '` validator type in `' + this.getName() +
      '` class schema does not exist'
    );
  }

  // Get validator. It will be used for further data checking.
  var validator = Validators[validatorData.type];

  // Make sure that `options` and `messages` are at least empty objects because
  // validator's `validate` function will look for attributes in these objects.
  validatorData.options = validatorData.options || {};
  validatorData.messages = validatorData.messages || validator.messages;

  if (!_.isObject(validatorData.options)) {
    throw new Error(
      'The validator options in `' + this.getName() +
      '` class schema have to be an object'
    );
  }
  if (!_.isObject(validatorData.messages)) {
    throw new Error(
      'The validator messages in `' + this.getName() +
      '` class schema have to be an object'
    );
  }

  // Check if all required options are provided.
  if (_.has(validator, 'requiredOptions')) {
    var hasAll = _.every(validator.requiredOptions, function(requiredOption) {
      return _.has(validatorData.options, requiredOption);
    });
    if (!hasAll) {
      throw new Error(
        'All required validator options in `' + this.getName() +
        '` class schema have to be provided'
      );
    }
  }

  // Validators data are stored in the array.
  this._validators.push(validatorData);
};

prototype.addValidators = function(validatorsData) {
  // Validators data has to be an array of objects.
  if (!_.isArray(validatorsData)) {
    throw new Error(
      'The validators data in `' + this.getName() +
      '` class schema has to be an array of objects'
    );
  }

  // Loop through array of validators data and check for each one if it's
  // object.
  _.each(validatorsData, function(validatorData) {
    if (!_.isObject(validatorData)) {
      throw new Error(
        'The validators data in `' + this.getName() +
        '` class schema has to be an array of objects'
      );
    }

    this.addValidator(validatorData);
  }, this);
};
