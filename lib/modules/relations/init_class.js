var checks = {};

checks.relationName = function(relationName) {
  // Check if the field name had been provided and is a string.
  if (!_.isString(relationName)) {
    throw new Error(
      'The relation name in the "' + this.getName() +
      '" class schema has to be a string'
    );
  }
};

checks.definitions = function(relationsDefinition) {
  if (!_.isObject(relationsDefinition)) {
    // Relations definition has to be an object.
    throw new Error(
      'The relations definition in the "' + this.getName() +
      '" class schema has to be an object'
    );
  }
};

checks.definition = function(relationName, relationDefinition) {
  if (!_.isObject(relationDefinition)) {
    // Relation definition has to be an object.
    throw new Error(
      'The relation definition for the "' + relationName +
      '" relation in the "' + this.getName() +
      '" class schema has to be an object'
    );
  }

  if (relationDefinition.type !== 'one' && relationDefinition.type !== 'many') {
    // Relation type should be one of two values: "one" or "many".
    throw new Error(
      'The relation type for the "' + relationName +
      '" relation in the "' + this.getName() +
      '" class schema should be "one" or "many"'
    );
  }
};

var methods = {};

methods.hasRelation = function(relationName) {
  checks.relationName.call(this, relationName);

  return _.has(this.schema.relations, relationName);
};

methods.getRelation = function(relationName) {
  checks.relationName.call(this, relationName);

  return this.schema.relations[relationName];
};

methods.getRelations = function() {
  return this.schema.relations;
};

methods.addRelations = function(relationsDefinition) {
  checks.definitions.call(this, relationsDefinition);

  _.each(relationsDefinition, function(relationDefinition, relationName) {
    this.addRelation(relationName, relationsDefinition[relationName]);
  }, this);
};


methods.addRelation = function(relationName, relationDefinition) {
  // Do params checking. The params checking can throw an error.
  checks.relationName.call(this, relationName);
  // If the relation already exists then just break. When adding relation, we also try to add an opposit relation to the foreign schema. It could cause circular method execution. It's why we have to stop execution.
  if (this.hasRelation(relationName)) {
    return;
  }
  checks.definition.call(this, relationName, relationDefinition);

  // Define setter and getter for the relation.
  Object.defineProperty(this.prototype, relationName, {
    get: function() {
      return this.getRelated(relationName);
    },
    set: function(value) {
      this.setRelated(relationName, value);
    }
  });

  // Add relation definition to the schema.
  this.schema.relations[relationName] = relationDefinition;
};

relationsOnInitClass = function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);

  // Add the "relations" attribute to the schema.
  Class.schema.relations = {};

  if (_.has(schemaDefinition, 'relations')) {
    Class.addRelations(schemaDefinition.relations);
  }
};
