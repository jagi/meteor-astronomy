Astro.ManyNestedField = class ManyNestedField extends Astro.NestedField {
  constructor(definition) {
    super(definition);

    this.type = definition.type === undefined || definition.type === null ?
      null : Astro.Type.get(definition.type);
    this.class = definition.class === undefined ?
      null : Astro.Class.get(definition.class);
  }

  validate(doc, fieldName) {
    super(doc, fieldName);

    let fieldValue = doc.get(fieldName);
    if (fieldValue !== null) {
      Validators.array(doc, fieldName);

      if (this.type) {
        _.each(fieldValue, function(element, index) {
          this.type.validate(doc, fieldName + '.' + index);
        }, this);
      }
      else if (this.class) {
        _.each(fieldValue, function(element, index) {
          Validators.instanceOf(doc, fieldName + '.' + index, this.class);
        }, this);
      }
    }
  }
};
