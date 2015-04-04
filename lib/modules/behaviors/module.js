Astronomy.Module({
  name: 'Behaviors',
  initSchema: function(Class, definition) {
    this._behaviors = {};

    if (_.has(definition, 'behaviors')) {
      this.addBehaviors(definition.behaviors);
    }
  }
});
