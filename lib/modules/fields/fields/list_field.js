Astro.ListField = class ListField extends Astro.Field {
  constructor(definition) {
    super(definition);

    this.type = definition.type === undefined || definition.type === null ?
      null : definition.type;
    this.class = definition.class === undefined ?
      null : definition.class;
  }

  validate(args) {
    super(args);
    var { doc, name, value } = args;

    if (value !== null && value !== undefined) {
      Validators.array(args);

      if (this.type) {
        _.each(value, function(element, index) {
          this.type.validate({ doc, name, value: element });
        }, this);
      }
      else if (this.class) {
        _.each(value, function(element, index) {
          Validators.class({ doc, name, value: element, param: this.class });
        }, this);
      }
    }
  }
};
