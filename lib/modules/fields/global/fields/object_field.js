Astro.ObjectField = class ObjectField extends Astro.Field {
  constructor(definition) {
    super(definition);

    this.class = definition.class === undefined ?
      null : definition.class;
  }

  validate(doc, fieldName) {
    super(doc, fieldName);

    let fieldValue = doc.get(fieldName);
    if (this.class && fieldValue !== null) {
      Validators.instanceOf(doc, fieldName, this.class);
    }
  }
};
