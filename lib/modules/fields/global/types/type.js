Astro.Type = class Type {
  validate(doc, fieldName) {
    return true;
  }

  cast(value) {
    return value;
  }

  raw(value) {
    return value;
  }

  static create(definition) {
    let type = new Type();

    if (_.has(definition, 'validate')) {
      type.validate = definition.validate;
    }

    if (_.has(definition, 'cast')) {
      type.cast = definition.cast;
    }

    if (_.has(definition, 'raw')) {
      type.raw = definition.raw;
    }

    Astro.Type.types[definition.name] = type;
  }

  static get(typeName) {
    return Astro.Type.types[typeName];
  }
};