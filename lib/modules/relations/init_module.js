var checkFieldName = function(fieldName) {
  // Check if the field name had been provided and is a string.
  if (!_.isString(fieldName)) {
    throw new Error('The relation name in the "' + this.getName() + '" class schema has to be a string');
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

  prototype.addRelation = function(alias, relationDefinition) {
    checkFieldName.call(this, alias);
    // If the relation already exists then just break. When adding relation, we also try to add an opposit relation to the foreign schema. It could cause circular method execution. It's why we have to stop execution.
    if (this.hasRelation(alias)) {
      return;
    }
    checkDefinition.call(this, alias, relationDefinition);

    // Get a foreign schema.
    var foreignSchema = Classes[relationDefinition.class].schema;

    if (relationDefinition.type === 'one') {
      this.addField(alias, {
        type: 'object',
        default: null
      });
    } else if (relationDefinition.type === 'many') {
      this.addField(alias, {
        type: 'array',
        default: []
      });
    }

    // Try adding local field if it's not defined.
    if (!this.hasField(relationDefinition.local)) {
      this.addField(relationDefinition.local, 'string');
    }

    // Add relation definition to the schema.
    this._relations[alias] = relationDefinition;

    // Add the opposit relation to the foreign schema.
    var schema = this;
    Meteor.defer(function() {
      foreignSchema.addRelation(relationDefinition.foreignAlias, {
        foreignAlias: alias,
        class: schema.getName(),
        type: relationDefinition.foreignType,
        foreignType: relationDefinition.type,
        local: relationDefinition.foreign,
        foreign: relationDefinition.local
      });
    });
  };

  prototype.addRelations = function(relationsDefinition) {
    checkDefinitions.call(this, relationsDefinition);

    _.each(relationsDefinition, function(relationDefinition, fieldName) {
      this.addRelation(fieldName, relationsDefinition[fieldName]);
    }, this);
  };
};
