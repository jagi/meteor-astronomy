import _has from 'lodash/has';
import _each from 'lodash/each';
import _includes from 'lodash/includes';
import deprecated from '../../core/utils/deprecated';
import throwParseError from '../../core/utils/throw_parse_error.js';
import reservedKeywords from '../../../core/reserved_keywords.js';

function onParseDefinition(parsedDefinition, definition, className) {
  if (definition.methods) {
    definition.helpers = definition.helpers || {};
    deprecated(
      `Methods have been renamed to helpers. Please use the "helpers" ` +
      `section in the "${className}" class definition.`
    );
    _each(definition.methods, (method, methodName) => {
      if (_has(definition.helpers, methodName)) {
        deprecated(
          `Methods have been renamed to helpers. Please move the ` +
          `"${methodName}" method to the "helpers" section in the ` +
          `"${className}" class definition.`
        );
      }
      else {
        definition.helpers[methodName] = method;
      }
    });
  }
  // Check existence and validity of the "helpers" property.
  if (definition.helpers !== undefined) {
    if (!Match.test(definition.helpers, Object)) {
      throwParseError([{
          'class': className
        }, {
          'property': 'helpers'
        },
        'Helpers definition has to be an object'
      ]);
    }

    _each(definition.helpers, (helper, helperName) => {
      if (!Match.test(helper, Function)) {
        throwParseError([{
            'class': className
          }, {
            'helper': helperName
          },
          'Helper has to be a function'
        ]);
      }

      if (_includes(reservedKeywords, helperName)) {
        throwParseError([{
            'class': className
          }, {
            'helper': helperName
          },
          'Reserved keyword'
        ]);
      }
      parsedDefinition.helpers[helperName] = helper;
    });
  }
};

export default onParseDefinition;