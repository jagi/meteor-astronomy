const errorsPattern = [{
  type: String,
  name: String,
  value: Match.Optional(Match.Any),
  param: Match.Optional(Match.Any),
  error: Match.Optional(String)
}];

Astro.ValidationError = class ValidationError extends Meteor.Error {
  constructor(errors, reason = Astro.ValidationError.DEFAULT_REASON) {
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

Astro.ValidationError.ERROR_CODE = 'validation-error';
Astro.ValidationError.DEFAULT_REASON = 'Validation failed';