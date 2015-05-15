var setRelated = function(relationName, value) {
};

var getRelated = function(relationName) {
  // If there is already a reference to the relation object(s) stored in the
  // "_references" object then we can take it without looking in collection.
  if (_.has(this._references, relationName)) {
    return this._references[relationName];
  }

  // Get a relation definition for the given gelation name.
  var relation = this.constructor.schema.getRelation(relationName);

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

relationsOnInitClass = function() {
  this.prototype.setRelated = setRelated;
  this.prototype.getRelated = getRelated;
};
