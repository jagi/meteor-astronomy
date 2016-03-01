import throwParseError from '../../../core/utils/throw_parse_error.js';
import castNested from '../../fields/utils/cast_nested.js';
import AstroClass from '../../../core/class.js';
import ObjectField from '../../fields/object_field.js';
import ListField from '../../fields/list_field.js';
import Validators from '../validators.js';
import { ValidationError } from 'meteor/mdg:validation-error';

function documentValidate({
  doc,
  fieldsNames,
  prefix = '',
  stopOnFirstError = true
}) {
  if (!Match.test(doc, AstroClass)) {
    throwParseError([{
        'module': 'validators'
      }, {
        'utility': 'documentValidate'
      }, {
        'argument': 'doc'
      },
      'Document has to be an instance of the Astronomy class'
    ]);
  }
  if (!Match.test(fieldsNames, [String])) {
    throwParseError([{
        'module': 'validators'
      }, {
        'utility': 'documentValidate'
      }, {
        'argument': 'fieldsNames'
      },
      'Argument has to be an array of strings'
    ]);
  }

  let Class = doc.constructor;

  // Cast nested fields.
  castNested(doc);

  // Prepare array for storing errors list.
  let errors = [];

  // Helper function for catching and collecting errors.
  const catchValidationError = (func) => {
    try {
      func();
    }
    catch (err) {
      // If it's ValidationError.
      if (ValidationError.is(err)) {
        // If we stop on first error then just throw error again.
        if (stopOnFirstError) {
          throw err;
        }
        // Otherwise we collect errors.
        else {
          _.each(err.details, (details) => {
            errors.push(details);
          });
        }
      }
      // It it's not ValidationError, then we throw error again.
      else {
        throw err;
      }
    }
  };

  _.each(fieldsNames, (name) => {
    let field = Class.getField(name);

    // Move to the next one if a field does not exist.
    if (!field) {
      return;
    }

    // We do not validate transient fields.
    if (field.transient) {
      return;
    }

    // Get value of the field.
    let value = doc.get(name);

    // Execute validation in the try-catch block. That's because we want to
    // continue validation if the "stopOnFirstError" flag is set to false.
    catchValidationError(() => {
      // First, execute type validators.
      field.validate({
        doc,
        name: prefix + name,
        nestedName: name,
        value
      });
      // Get validators for a given field.
      let validators = Class.getValidators(name);
      _.each(validators, ({
        type,
        param,
        resolveParam,
        message,
        resolveError
      }) => {
        // Get validation helper function.
        let validationFunction = Validators[type];
        // Execute single validator.
        validationFunction({
          doc,
          name: prefix + name,
          nestedName: name,
          value,
          param,
          resolveParam,
          message,
          resolveError
        });
      });
    });

    // If it is the object field then validate it.
    if (field instanceof ObjectField) {
      if (value instanceof AstroClass) {
        catchValidationError(() => {
          documentValidate({
            doc: value,
            fieldsNames: field.class.getValidationOrder(),
            prefix: field.name + '.',
            stopOnFirstError
          });
        });
      }
    }
    // If it is the list field then validate each one.
    else if (field instanceof ListField && field.class) {
      _.each(value, (element, index) => {
        let fieldNames = field.class.getValidationOrder();
        if (element instanceof AstroClass) {
          catchValidationError(() => {
            documentValidate({
              doc: element,
              fieldsNames,
              prefix: field.name + '.' + index + '.',
              stopOnFirstError
            });
          });
        }
      });
    }
  });

  // If we have not thrown any error yet then it means that there were no errors
  // or we do not throw on the first error.
  if (errors.length > 0) {
    throw new ValidationError(errors, errors[0].message);
  }
};

export default documentValidate;