import throwParseError from '../../core/utils/throw_parse_error.js';

function onParseDefinition(parsedDefinition, definition, className) {
  // Check existence and validity of the "collection" property.
  if (definition.collection !== undefined) {
    // The "collection" property has to be an instance of the
    // "Mongo.Collection".
    if (!(definition.collection instanceof Mongo.Collection)) {
      throwParseError([{
          'class': className
        }, {
          'property': 'collection'
        },
        'Property value has to be an instance of "Mongo.Collection"'
      ]);
    }
    parsedDefinition.collection = definition.collection;
  }

  // Check existence and validity of the "typeField" property.
  if (definition.typeField !== undefined) {
    // The "typeField" property has to be a string.
    if (!Match.test(definition.typeField, String)) {
      throwParseError([{
          'class': className
        }, {
          'property': 'typeField'
        },
        'Property value has to be a string'
      ]);
    }
    parsedDefinition.typeField = definition.typeField;
  }

  // Check existence and validity of the "transform" property.
  if (definition.transform !== undefined) {
    // The "transform" property has to be a function.
    if (!Match.test(definition.transform, Match.OneOf(Function, null))) {
      throwParseError([{
          'class': className
        }, {
          'property': 'transform'
        },
        'Property value has to be a function or null'
      ]);
    }
    parsedDefinition.transform = definition.transform;
  }

  // Check existence and validity of the "secured" property.
  if (definition.secured !== undefined) {
    if (!Match.test(definition.secured, Match.OneOf(Boolean, Object))) {
      throwParseError([{
          'class': className
        }, {
          'property': 'secured'
        },
        'Property value has to be a boolean or an object with keys being ' +
        'method name and values being boolean'
      ]);
    }
    if (typeof definition.secured === 'boolean') {
      parsedDefinition.secured = {
        common: definition.secured
      };
    }
    else {
      parsedDefinition.secured = definition.secured;
    }
  }
};

export default onParseDefinition;