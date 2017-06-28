import _each from 'lodash/each';
import _includes from 'lodash/includes';
import throwParseError from '../../core/utils/throw_parse_error.js';
import reservedKeywords from '../../../core/reserved_keywords.js';

function onParseDefinition(parsedDefinition, definition, className) {
  // Check existence and validity of the "meteorMethods" property.
  if (definition.meteorMethods !== undefined) {
    if (!Match.test(definition.meteorMethods, Object)) {
      throwParseError([{
          'class': className
        }, {
          'property': 'meteorMethods'
        },
        'meteorMethods definition has to be an object'
      ]);
    }

    _each(definition.meteorMethods, function(meteorMethod, meteorMethodName) {
      if (!Match.test(meteorMethod, Function)) {
        throwParseError([{
            'class': className
          }, {
            'meteorMethod': meteorMethodName
          },
          'Meteor method has to be a function'
        ]);
      }

      if (_includes(reservedKeywords, meteorMethodName)) {
        throwParseError([{
            'class': className
          }, {
            'meteorMethod': meteorMethodName
          },
          'Reserved keyword'
        ]);
      }
      parsedDefinition.meteorMethods[meteorMethodName] = meteorMethod;
    });
  }
};

export default onParseDefinition;