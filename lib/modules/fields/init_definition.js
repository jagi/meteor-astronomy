Astro.eventManager.on('initDefinition', function(schemaDefinition) {
  if (_.has(schemaDefinition, 'fields')) {
    var fields = {};
    if (_.isArray(schemaDefinition.fields)) {
      _.each(schemaDefinition.fields, function(fieldName) {
        fields[fieldName] = {
          name: fieldName,
          type: 'null'
        };
      });
    } else if (_.isObject(schemaDefinition.fields)) {
      _.each(schemaDefinition.fields, function(fieldDefinition, fieldName) {
        if (_.isString(fieldDefinition)) {
          fields[fieldName] = {
            name: fieldName,
            type: fieldDefinition
          };
        } else if (_.isObject(fieldDefinition)) {
          fields[fieldName] = _.extend({
            type: 'null'
          }, fieldDefinition, {
            name: fieldName
          });
        }
      });
    }

    schemaDefinition.fields = fields;
  }
});
