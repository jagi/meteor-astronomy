Astro.OneNestedField = class OneNestedField extends Astro.NestedField {
  constructor(definition) {
    super(definition);

    this.class = definition.class === undefined ?
      null : Astro.Class.get(definition.class);
  }

  validate(doc, fieldName) {
    super(doc, fieldName);

    let fieldValue = doc.get(fieldName);
    if (this.class && fieldValue !== null) {
      Validators.instanceOf(doc, fieldName, this.class);
    }
  }
};
