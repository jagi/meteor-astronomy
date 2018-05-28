import _find from "lodash/find";
import _has from "lodash/has";
import Validators from "../validators/validators.js";
import warn from "../core/utils/warn";

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

    if (typeof definition.validate === "function") {
      this.validate = definition.validate;
    }

    if (typeof definition.cast === "function") {
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
    // Warn about class duplicate.
    if (_has(this.types, type.name)) {
      warn(`Duplicate of the "${type.name}" type`);
    }
    this.types[type.name] = type;
  }

  static get(name) {
    return this.types[name];
  }

  static has(name) {
    return _has(this.types, name);
  }

  static find(Class) {
    return _find(this.types, type => {
      return type.class.prototype === Class.prototype;
    });
  }
}

Type.types = {};

export default Type;
