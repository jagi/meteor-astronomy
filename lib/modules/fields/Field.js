import {
  defaults,
  extend,
  isFunction,
  isNil
}
from 'lodash';
import Validators from '../validators/validators.js';

class Field {
  constructor(definition = {}) {
    defaults(definition, {
      optional: false,
      immutable: false,
      transient: false
    });
    extend(this, definition);
  }

  getDefault() {
    if (isFunction(this.default)) {
      return this.default();
    }
    return this.default;
  }

  getOptional(doc) {
    if (isFunction(this.optional)) {
      return this.optional(doc);
    }
    return this.optional;
  }

  validate(args) {
    // If a field is not optional (required) then it has to have value.
    if (!this.getOptional(args.doc)) {
      Validators.required(args);
    }
  }

  castValue(value) {
    if (isFunction(this.cast) && !isNil(value)) {
      return this.cast(value);
    }
    return value;
  }

  resolveValue(rawDoc) {
    if (isFunction(this.resolve)) {
      return this.resolve(rawDoc);
    }
    return rawDoc[this.name];
  }
};

export default Field;