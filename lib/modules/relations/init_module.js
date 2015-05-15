var checkFieldName = function(relationName) {
  // Check if the field name had been provided and is a string.
  if (!_.isString(relationName)) {
    throw new Error('The relation name in the "' + this.getName() + '" class schema has to be a string');
  }
};

var checkDefinitions = function(relationsDefinition) {
  if (!_.isObject(relationsDefinition)) {
    // Relations definition has to be an object.
    throw new Error('The relations definition in the "' + this.getName() + '" class schema has to be an object');
  }
};

var checkDefinition = function(relationName, relationDefinition) {
  if (!_.isObject(relationDefinition)) {
    // Relation definition has to be an object.
    throw new Error('The relation definition for the "' + relationName + '" relation in the "' + this.getName() + '" class schema has to be an object');
  }

  if (relationDefinition.type !== 'one' && relationDefinition.type !== 'many') {
    // Relation type should be one of two values: "one" or "many".
    throw new Error('The relation type for the "' + relationName + '" relation in the "' + this.getName() + '" class schema should be "one" or "many"');
  }
};

relationsOnInitModule = function() {
  var prototype = Astro.Schema.prototype;

  prototype.hasRelation = function(fieldName) {
    checkFieldName.call(this, fieldName);

    return _.has(this._relations, fieldName);
  };

  prototype.getRelation = function(fieldName) {
    checkFieldName.call(this, fieldName);

    return this._relations[fieldName];
  };

  prototype.getRelations = function() {
    return this._relations;
  };

  prototype.addRelation = function(relationName, relationDefinition) {
    // Do params checking. The params checking can throw an error.
    checkFieldName.call(this, relationName);
    // If the relation already exists then just break. When adding relation, we also try to add an opposit relation to the foreign schema. It could cause circular method execution. It's why we have to stop execution.
    if (this.hasRelation(relationName)) {
      return;
    }
    checkDefinition.call(this, relationName, relationDefinition);

    // Define setter and getter for the relation.
    Object.defineProperty(this.getClass().prototype, relationName, {
      get: function() {
        return this.getRelated(relationName);
      },
      set: function(value) {
        this.setRelated(relationName, value);
      }
    });

    // Add relation definition to the schema.
    this._relations[relationName] = relationDefinition;
  };

  prototype.addRelations = function(relationsDefinition) {
    checkDefinitions.call(this, relationsDefinition);

    _.each(relationsDefinition, function(relationDefinition, fieldName) {
      this.addRelation(fieldName, relationsDefinition[fieldName]);
    }, this);
  };
};
