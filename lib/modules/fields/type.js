import _ from 'lodash';
import Validators from '../validators/validators.js';

const typeDefinitionPattern = {
  name: String,
  class: Match.Any,
  cast: Match.Optional(Function),
  validate: Match.Optional(Function)
};

const enumDefinitionPattern = {
  name: String,
  options: Object
};

class Type {
  constructor(definition) {
    check(definition, typeDefinitionPattern);

    this.name = definition.name;
    this.class = definition.class;

    if (_.isFunction(definition.validate)) {
      this.validate = definition.validate;
    }

    if (_.isFunction(definition.cast)) {
      this.cast = definition.cast;
    }
  }

  cast(value) {
    return value;
  }

  validate(doc, fieldName) {
    return true;
  }

  static create(definition) {
    let type = new Type(definition);
    this.types[type.name] = type;
  }

  static get(name) {
    return this.types[name];
  }

  static has(name) {
    return _.has(this.types, name);
  }

  static find(Class) {
    return _.find(this.types, (type) => {
      return type.class.prototype === Class.prototype;
    });
  }
};

Type.types = {};

export default Type;