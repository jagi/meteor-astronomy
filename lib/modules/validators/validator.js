import { ValidationError } from 'meteor/mdg:validation-error';
import Validators from './validators.js';

class Validator {
  constructor(definition) {
    this.name = definition.name;
    this.parseParam = definition.parseParam;
    this.isValid = definition.isValid;
    this.resolveError = definition.resolveError;
  }

  validate({
    doc,
    name,
    nestedName,
    value,
    param,
    resolveParam,
    message,
    resolveError
  }) {
    // Resolve param is the "resolveParam" function is provided.
    if (Match.test(resolveParam, Function)) {
      param = resolveParam({
        doc,
        name,
        nestedName,
        value
      });
    }
    // Parse param type if validator has parsing function.
    if (Match.test(this.parseParam, Function)) {
      this.parseParam(param);
    }
    // Prepare data for validation.
    let args = {
      doc,
      name,
      nestedName,
      value,
      param
    };

    // Perform validation.
    if (!this.isValid(args)) {
      // Prepare function for throwing validation error.
      const throwError = (message) => {
        // Throw error only if the error message has been successfully
        // generated.
        if (!message) {
          return;
        }
        // Throw error.
        throw new ValidationError([{
          type: this.name,
          name,
          nestedName,
          value,
          param,
          message
        }], message);
      };
      // Generate error message using the "resolveError" function if provided.
      if (Match.test(resolveError, Function)) {
        throwError(resolveError(args));
      }
      // Get error message from the string if provided.
      if (Match.test(message, String)) {
        throwError(message);
      }
      // Get error by executing a class level "resolveError" function.
      let Class = doc.constructor;
      let classResolveError = Class.getResolveError();
      if (classResolveError instanceof Function) {
        throwError(classResolveError(args));
      }
      // Get default error message.
      if (this.resolveError instanceof Function) {
        throwError(this.resolveError(args));
      }
      throwError(ValidationError.DEFAULT_REASON);
    }
  }

  static create(definition) {
    let validator = new Validator(definition);
    Validator.validators[validator.name] = validator;

    // Create validation function that takes validator, some params and performs
    // validation.
    return Validators[validator.name] = function(options) {
      validator.validate(options);
    }
  }
};

Validator.validators = {};

export default Validator;