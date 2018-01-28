import _defaults from 'lodash/defaults';
import _extend from 'lodash/extend';
import _isNil from 'lodash/isNil';
import Validators from '../validators/validators.js';

class Field {
  constructor(definition = {}) {
    _defaults(definition, {
      optional: false,
      immutable: false,
      transient: false
    });
    _extend(this, definition);
  }

  getDefault(doc) {
    const value = typeof this.default === 'function'
      ? this.default(doc)
      : this.default;
    return this.castValue(value, {
      cast: true
    });
  }

  getOptional(doc) {
    if (typeof this.optional === 'function') {
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

  castValue(value, options) {
    if (!_isNil(value)) {
      return this.cast(value, options);
    }
    return value;
  }

  resolveValue(rawDoc) {
    if (!rawDoc) {
      return;
    }
    if (typeof this.resolve === 'function') {
      return this.resolve(rawDoc);
    }
    return rawDoc[this.name];
  }
};

export default Field;