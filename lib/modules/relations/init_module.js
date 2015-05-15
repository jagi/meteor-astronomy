var checkFieldName = function(relationName) {
  // Check if the field name had been provided and is a string.
  if (!_.isString(relationName)) {
    throw new Error('The relation name in the "' + this.getName() +
      '" class schema has to be a string');
  }
};

var checkDefinitions = function(relationsDefinition) {
  if (!_.isObject(relationsDefinition)) {
    // Relations definition has to be an object.
    throw new Error('The relations definition in the "' + this.getName() +
      '" class schema has to be an object');
  }
};

var checkDefinition = function(relationName, relationDefinition) {
  if (!_.isObject(relationDefinition)) {
    // Relation definition has to be an object.
    throw new Error('The relation definition for the "' + relationName +
      '" relation in the "' + this.getName() +
      '" class schema has to be an object');
  }

  if (relationDefinition.type !== 'one' && relationDefinition.type !== 'many') {
    // Relation type should be one of two values: "one" or "many".
    throw new Error('The relation type for the "' + relationName +
      '" relation in the "' + this.getName() +
      '" class schema should be "one" or "many"');
  }
};

relationsOnInitModule = function() {
  var schemaProto = Astro.Schema.prototype;

  schemaProto.hasRelation = function(fieldName) {
    checkFieldName.call(this, fieldName);

    return _.has(this._relations, fieldName);
  };

  schemaProto.getRelation = function(fieldName) {
    checkFieldName.call(this, fieldName);

    return this._relations[fieldName];
  };

  schemaProto.getRelations = function() {
    return this._relations;
  };

  schemaProto.addRelation = function(relationName, relationDefinition) {
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

  schemaProto.addRelations = function(relationsDefinition) {
    checkDefinitions.call(this, relationsDefinition);

    _.each(relationsDefinition, function(relationDefinition, fieldName) {
      this.addRelation(fieldName, relationsDefinition[fieldName]);
    }, this);
  };

  var baseClassProto = Astro.BaseClass.prototype;

  baseClassProto.setRelated = function(relationName, value) {};

  baseClassProto.getRelated = function(relationName) {
    // If there is already a reference to the relation object(s) stored in the
    // "_references" object then we can take it without looking in collection.
    if (_.has(this._references, relationName)) {
      return this._references[relationName];
    }

    // Get a relation definition for the given gelation name.
    var relation;
    _.find(this.constructor.schemas, function(schema) {
      return relation = schema.getRelation(relationName);
    });
    if (!relation) {
      return;
    }

    // Get a collection defined in the relation.
    var ForeignClass = Classes[relation.class];
    var foreignSchema = ForeignClass.schema;
    var ForeignCollection = foreignSchema.getCollection();

    // Prepare selector to select only these documents that much the relation.
    var selector = {};
    selector[relation.foreign] = this.get(relation.local);

    // Get a related object.
    var related;
    if (relation.type === 'one') {
      related = ForeignCollection.findOne(selector);
    } else if (relation.type === 'many') {
      related = ForeignCollection.find(selector);
    }

    // Assing the related object to the "_references" object for further use.
    return this._references[relationName] = related;
  };
};
