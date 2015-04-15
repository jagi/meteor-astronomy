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

prototype.addValidator = function(fieldName, validatorData) {
  // We have to make sure that all the necessary data is provided. Later, when
  // validating field value, we shouldn't think about checking whether user
  // provided all the data. It's why we are doing it here.

  // Check if user provided all the necessary validation data for the given
  // field in the class schema.
  if (!_.isObject(validatorData)) {
    throw new Error(
      'The validation data for `' + fieldName + '` field in `' +
      this.getName() + '` class schema has to be an object'
    );
  }
  if (!_.has(validatorData, 'type')) {
    throw new Error(
      'The validator type for `' + fieldName + '` field in `' +
      this.getName() + '` class schema can not be empty'
    );
  }

  // Check whether given validator type exists.
  if (!_.has(Validators, validatorData.type)) {
    throw new Error(
      'The `' + validatorData.type + '` validator type for `' + fieldName +
      '` field in `' + this.getName() + '` class schema does not exist'
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
      'The validator options for `' + fieldName + '` field in `' +
      this.getName() + '` class schema have to be an object'
    );
  }
  if (!_.isObject(validatorData.messages)) {
    throw new Error(
      'The validator messages for `' + fieldName + '` field in `' +
      this.getName() + '` class schema have to be an object'
    );
  }

  // Check if all required options are provided.
  if (_.has(validator, 'requiredOptions')) {
    var hasAll = _.every(validator.requiredOptions, function(requiredOption) {
      return _.has(validatorData.options, requiredOption);
    });
    if (!hasAll) {
      throw new Error(
        'All required validator options for `' + fieldName +
        '` field in `' + this.getName() + '` class schema have to be provided'
      );
    }
  }

  // Validators data are stored in the array because we can have more than one
  // validator per field.
  this._validators[fieldName] = this._validators[fieldName] || [];
  this._validators[fieldName].push(validatorData);
};

prototype.addValidators = function(validatorsData) {
  if (!_.isObject(validatorsData)) {
    throw new Error(
      'The validation data in `' + this.getName() +
      '` class schema has to be an object'
    );
  }

  _.each(validatorsData, function(validatorData, fieldName) {
    if (_.isArray(validatorData)) {
      _.each(validatorData, function(singleValidatorData) {
        this.addValidator(fieldName, singleValidatorData);
      }, this);
    } else if (_.isObject(validatorData)) {
      this.addValidator(fieldName, validatorData);
    } else {
      throw new Error(
        'The validation data for `' + fieldName + '` field in `' +
        this.getName() + '` class schema has to be an object or array'
      );
    }
  }, this);
};
