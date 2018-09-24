import _each from 'lodash/each';
import _intersection from 'lodash/intersection';
import _isNil from 'lodash/isNil';
import AstroClass from '../../../core/class';
import throwParseError from '../../core/utils/throw_parse_error';
import castNested from '../../fields/utils/castNested';
import isNestedFieldName from '../../fields/utils/isNestedFieldName';
import traverse from '../../fields/utils/traverse';
import ObjectField from '../../fields/ObjectField';
import ListField from '../../fields/ListField';
import Validators from '../validators';
import {
  ValidationError
}
from 'meteor/mdg:validation-error';

function documentValidate(options = {}) {
  let {
    doc,
    fields,
    modified = false,
    prefix = '',
    stopOnFirstError = true,
    simulation = true
  } = options;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  let Class = doc.constructor;

  // Cast nested fields.
  castNested({
    doc,
    options: {
      clone: false
    }
  });

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
          _each(err.details, (details) => {
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

  // If no fields were passed to validation, then we pick default validation
  // order.
  if (!fields) {
    fields = Class.getValidationOrder();
  }

  // Validate only modified fields.
  if (modified && Class.getCollection()) {
    fields = _intersection(fields, doc.getModified());
  }

  _each(fields, (name) => {
    // If it is a nested field pattern name then we have to look for the most
    // nested document and validate the nested field.
    if (isNestedFieldName(name)) {
      traverse(doc, name, (nestedDoc, nestedName, field) => {
        catchValidationError(() => {
          documentValidate({
            doc: nestedDoc,
            fields: [nestedName],
            prefix: prefix + name.substr(0, name.lastIndexOf(nestedName)),
            stopOnFirstError,
            simulation
          });
        });
      });
      return;
    }

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

    // If a field is optional and value is undefined then we do not validate.
    if (field.getOptional(doc) && _isNil(value)) {
      return;
    }

    // Execute validation in the try-catch block. That's because we want to
    // continue validation if the "stopOnFirstError" flag is set to false.
    catchValidationError(() => {
      // First, execute type level validators.
      field.validate({
        doc,
        name: prefix + name,
        nestedName: name,
        value
      });
      // Get validators for a given field.
      let validators = Class.getValidators(name);
      _each(validators, ({
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
            fields: value.constructor.getValidationOrder(),
            prefix: prefix + field.name + '.',
            stopOnFirstError
          });
        });
      }
    }
    // If it is the list field then validate each one.
    else if (field instanceof ListField && field.isClass) {
      _each(value, (element, index) => {
        if (element instanceof AstroClass) {
          catchValidationError(() => {
            documentValidate({
              doc: element,
              fields: element.constructor.getValidationOrder(),
              prefix: prefix + field.name + '.' + index + '.',
              stopOnFirstError
            });
          });
        }
      });
    }
  });

  // If we have not thrown any error yet then it means that there are no errors
  // or we do not throw on the first error.
  if (errors.length > 0) {
    throw new ValidationError(errors, errors[0].message);
  }
};

export default documentValidate;
