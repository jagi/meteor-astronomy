Astro.ScalarField = class ScalarField extends Astro.Field {
  constructor(definition) {
    super(definition);

    this.type = definition.type === undefined || definition.type === null ?
      null : definition.type;
  }

  validate(args) {
    super.validate(args);
    var { value } = args;

    if (this.type && value !== null && value !== undefined) {
      return this.type.validate(args);
    }
  }
};
