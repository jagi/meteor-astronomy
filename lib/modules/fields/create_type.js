Astro.createType = function(typeDefinition) {
  if (!_.isObject(typeDefinition)) {
    throw new Error('Provide type definition');
  }
  if (!_.has(typeDefinition, 'name')) {
    throw new Error('Type name is required');
  }

  var Type;
  if (
    _.has(typeDefinition, 'constructor') &&
    _.isFunction(typeDefinition.constructor)
  ) {
    Type = typeDefinition.constructor;
  } else {
    Type = function TypeField() {
      Astro.BaseField.apply(this, arguments);
    };
  }
  var ParentType = typeDefinition.inherit ?
    typeDefinition.inherit : Astro.BaseField;

  // Inherit from the BaseClass or a provided class.
  Astro.utils.class.inherits(Type, ParentType);

  if (_.isFunction(typeDefinition.getDefault)) {
    Type.prototype._getDefault = typeDefinition.getDefault;
  }
  if (_.isFunction(typeDefinition.needsCast)) {
    Type.prototype._needsCast = typeDefinition.needsCast;
  }
  if (_.isFunction(typeDefinition.cast)) {
    Type.prototype._cast = typeDefinition.cast;
  }
  if (_.isFunction(typeDefinition.needsPlain)) {
    Type.prototype._needsPlain = typeDefinition.needsCast;
  }
  if (_.isFunction(typeDefinition.plain)) {
    Type.prototype._plain = typeDefinition.plain;
  }

  Astro.fields[typeDefinition.name] = Type;
};
