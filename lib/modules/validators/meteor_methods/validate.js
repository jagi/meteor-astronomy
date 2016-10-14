import documentValidate from '../utils/document_validate.js';
import { check, Match } from 'meteor/check';

function validate(options) {
  check(options, Match.Any);

  return documentValidate(options);
};

export default validate;