Astro.ObjectField = class ObjectField extends Astro.Field {
  constructor(definition) {
    super(definition);

    this.class = definition.class === undefined ?
      null : definition.class;
  }

  validate(args) {
    super(args);
    var { doc, name, value } = args;

    if (this.class && value !== null && value !== undefined) {
      Validators.class({ doc, name, value, param: this.class });
    }
  }
};
