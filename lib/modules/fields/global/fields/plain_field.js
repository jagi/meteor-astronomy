Astro.PlainField = class PlainField extends Astro.Field {
  constructor(definition) {
    super(definition);

    this.type = definition.type === undefined || definition.type === null ?
      null : Astro.Type.get(definition.type);
  }

  validate(doc, fieldName) {
    super(doc, fieldName);

    let fieldValue = doc.get(fieldName);
    if (this.type && fieldValue !== null) {
      return this.type.validate(doc, fieldName);
    }
  }
};
