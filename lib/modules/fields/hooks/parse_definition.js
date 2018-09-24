import _each from 'lodash/each';
import _extend from 'lodash/extend';
import _includes from 'lodash/includes';
import throwParseError from '../../core/utils/throw_parse_error.js';
import Class from '../../../core/class.js';
import Type from '../type.js';
import reservedKeywords from '../../../core/reserved_keywords.js';

const typePattern = Match.OneOf(Function, [Function]);

function onParseDefinition(parsedDefinition, definition, className) {
  if (definition.fields === undefined) {
    return;
  }

  // Fields definition has to be an object.
  if (!Match.test(definition.fields, Object)) {
    throwParseError([{
        'class': className
      }, {
        'property': 'fields'
      },
      'Fields definition has to be an object'
    ]);
  }

  _each(definition.fields, function(fieldDefinition, fieldName) {
    if (Match.test(fieldDefinition, typePattern)) {
      fieldDefinition = {
        name: fieldName,
        type: fieldDefinition
      };
    }
    else if (Match.test(fieldDefinition, Object)) {
      fieldDefinition = _extend(fieldDefinition, {
        name: fieldName
      });
    }
    else {
      throwParseError([{
          'class': className
        }, {
          'property': 'fields'
        }, {
          'field': fieldName
        },
        'Field definition has to be an object or type'
      ]);
    }

    // Check if a field name is not reserved keyword.
    if (_includes(reservedKeywords, fieldName)) {
      throwParseError([{
          'class': className
        }, {
          'method': fieldName
        },
        'Reserved keyword'
      ]);
    }

    parsedDefinition.fields[fieldDefinition.name] = fieldDefinition;
  });
};

export default onParseDefinition;