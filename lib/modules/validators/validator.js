import { ValidationError } from 'meteor/mdg:validation-error';
import Validators from './validators.js';

class Validator {
  constructor(definition) {
    this.name = definition.name;
    if (definition.parseParam) {
      this.parseParam = definition.parseParam;
    }
    if (definition.isValid) {
      this.isValid = definition.isValid;
    }
    if (definition.validate) {
      this.validate = definition.validate;
    }
    if (definition.resolveError) {
      this.resolveError = definition.resolveError;
    }
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
    // Get the class name, which will be used later for letting know what class
    // thrown error.
    const className = doc.constructor.getName();

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
    const args = {
      className,
      doc,
      name,
      nestedName,
      value,
      param,
      validator: this.name
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
          className,
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

    // Create a validation function.
    return Validators[validator.name] = function(options) {
      validator.validate(options);
    }
  }
};

Validator.validators = {};

export default Validator;