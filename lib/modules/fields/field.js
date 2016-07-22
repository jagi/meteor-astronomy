import _ from 'lodash';
import Validators from '../validators/validators.js';

class Field {
  constructor(definition = {}) {
    _.defaults(definition, {
      optional: false,
      immutable: false,
      transient: false,
      private: false
    });

    this.name = definition.name;
    this.type = definition.type;
    this.default = definition.default
    this.optional = definition.optional;
    this.immutable = definition.immutable;
    this.transient = definition.transient;
    this.resolve = definition.resolve;
    this.private = definition.private;
  }

  getDefault() {
    if (_.isFunction(this.default)) {
      return this.default();
    }
    return this.default;
  }

  getOptional(doc) {
    if (_.isFunction(this.optional)) {
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

  resolveValue(rawDoc) {
    let value;
    if (this.resolve) {
      value = this.resolve(rawDoc);
    }
    else {
      value = rawDoc[this.name];
    }
    return value;
  }
};

export default Field;