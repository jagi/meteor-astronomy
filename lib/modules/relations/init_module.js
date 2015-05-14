var checkFieldName = function(fieldName) {
  // Check if the field name had been provided and is a string.
  if (!_.isString(fieldName)) {
    throw new Error('The relation name in the "' + this.getName() + '" class schema has to be a string');
  }
};

var checkIfDefined = function(fieldName) {
  // Check if a relation for the given field name had already been defined.
  if (_.has(this._relations, fieldName)) {
    throw new Error('The relation for the "' + fieldName + '" field had already been defined in the "' + this.getName() + '" class schema');
  }
};

var checkDefinitions = function(relationsDefinition) {
  if (!_.isObject(relationsDefinition)) {
    // Relations definition has to be an object.
    throw new Error('The relations definition in the "' + this.getName() + '" class schema has to be an object');
  }
};

var checkDefinition = function(fieldName, relationDefinition) {
  if (!_.isObject(relationDefinition)) {
    // Relation definition has to be an object.
    throw new Error('The relation definition for the "' + fieldName + '" field in the "' + this.getName() + '" class schema has to be an object');
  }

  if (relationDefinition.type !== 'one' && relationDefinition.type !== 'many') {
    // Relation type should be one of two values: "one" or "many".
    throw new Error('The relation type for the "' + fieldName + '" field in the "' + this.getName() + '" class schema should be "one" or "many"');
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

  prototype.addRelation = function(fieldName, relationDefinition) {
    checkFieldName.call(this, fieldName);
    checkIfDefined.call(this, fieldName);
    checkDefinition.call(this, fieldName, relationDefinition);

    if (relationDefinition.type === 'one') {
      this.addField(fieldName, {
        type: 'object',
        default: null
      });
    } else if (relationDefinition.type === 'many') {
      this.addField(fieldName, {
        type: 'array',
        default: []
      });
    }

    // Add relation definition to the schema.
    this._relations[fieldName] = relationDefinition;
  };

  prototype.addRelations = function(relationsDefinition) {
    checkDefinitions.call(this, relationsDefinition);

    _.each(relationsDefinition, function(relationDefinition, fieldName) {
      this.addRelation(fieldName, relationsDefinition[fieldName]);
    }, this);
  };
};
