import { Match } from 'meteor/check';
import { ValidationError } from 'meteor/mdg:validation-error';

function getCheckPattern() {
  const Class = this;
  return Match.Where(function(doc) {
    try {
      doc.validate();
    }
    catch(err) {
      if (ValidationError.is(err)) {
        const firstError = err.details[0];
        const matchError = new Match.Error(firstError.message);
        matchError.sanitizedError = err;
        throw matchError;
      }
      else {
        throw err;
      }
    }
    return true;
  });
};

export default getCheckPattern;