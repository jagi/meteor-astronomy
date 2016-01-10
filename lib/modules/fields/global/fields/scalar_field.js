Astro.ScalarField = class ScalarField extends Astro.Field {
  constructor(definition) {
    super(definition);

    this.type = definition.type === undefined || definition.type === null ?
      null : definition.type;
  }

  validate(doc, fieldName) {
    super(doc, fieldName);

    let fieldValue = doc.get(fieldName);
    if (this.type && fieldValue !== null) {
      return this.type.validate(doc, fieldName);
    }
  }
};
