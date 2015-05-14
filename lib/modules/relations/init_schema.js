relationsOnInitSchema = function(Class, definition) {
  this._relations = {};

  if (_.has(definition, 'relations')) {
    this.addRelations(definition.relations);
  }
};
