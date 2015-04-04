Astronomy.Module({
  name: 'Fields',
  initSchema: function(Class, definition) {
    this._fields = {};

    // Define `_id` field.
    definition.fields._id = {
      type: String,
      default: null
    };

    // Define `_type` field for storing child model name.
    if (this.getParentClass()) {
      definition.fields._type = {
        type: String,
        default: this.getName()
      };
    }

    if (_.has(definition, 'fields')) {
      this.addFields(definition.fields);
    }
  }
});
