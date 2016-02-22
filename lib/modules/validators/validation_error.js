const errorsPattern = [{
  type: String,
  name: String,
  pattern: Match.Optional(String),
  value: Match.Optional(Match.Any),
  param: Match.Optional(Match.Any),
  error: Match.Optional(String)
}];

class ValidationError extends Meteor.Error {
  constructor(errors, reason = ValidationError.DEFAULT_REASON) {
    check(errors, errorsPattern);
    check(reason, String);

    super(ValidationError.ERROR_CODE, reason, errors);
  }

  static check(err) {
    return err &&
      err instanceof Meteor.Error &&
      err.error === ValidationError.ERROR_CODE;
  };
};

ValidationError.ERROR_CODE = 'validation-error';
ValidationError.DEFAULT_REASON = 'Validation failed';

export default ValidationError;