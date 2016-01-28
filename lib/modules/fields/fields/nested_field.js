Astro.NestedField = class NestedField extends Astro.Field {
  constructor(definition) {
    super(definition);

    this.count = definition.count;
  }
};
