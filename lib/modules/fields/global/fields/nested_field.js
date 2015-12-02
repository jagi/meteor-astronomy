Astro.NestedField = class NestedField extends Astro.Field {
  constructor(definition) {
    super(definition);

    // Check if the "count" property is equal "one" or "many".
    if (definition.count !== 'one' && definition.count !== 'many') {
      throw new TypeError(
        'The "count" property has to be equal "one" or "many"'
      );
    }
    // Check if a class exists
    if (definition.class && !Astro.Class.get(definition.class)) {
      // throw new Error(
      //   'The "' + definition.class + '" class for the "' + definition.name +
      //   '" field does not exist'
      // );
    }

    this.count = definition.count;
    this.class = definition.class === undefined ?
      null : Astro.Class.get(definition.class);
  }
};
