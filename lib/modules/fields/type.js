import find from 'lodash/find';
import has from 'lodash/has';
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

    if (typeof definition.validate === 'function') {
      this.validate = definition.validate;
    }

    if (typeof definition.cast === 'function') {
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
    return has(this.types, name);
  }

  static find(Class) {
    return find(this.types, (type) => {
      return type.class.prototype === Class.prototype;
    });
  }
};

Type.types = {};

export default Type;