import _ from 'lodash';
import throwParseError from '../../core/utils/throw_parse_error.js';
import reservedKeywords from '../../../core/reserved_keywords.js';

function onParseDefinition(parsedDefinition, definition, className) {
	// Check existence and validity of the "methods" property.
	if (definition.methods !== undefined) {
		if (!Match.test(definition.methods, Object)) {
			throwParseError([{
					'class': className
				}, {
					'property': 'methods'
				},
				'Methods definition has to be an object'
			]);
		}

		_.each(definition.methods, function(method, methodName) {
			if (!Match.test(method, Function)) {
				throwParseError([{
						'class': className
					}, {
						'method': methodName
					},
					'Method has to be a function'
				]);
			}

      if (_.includes(reservedKeywords, methodName)) {
        throwParseError([{
						'class': className
					}, {
						'method': methodName
					},
					'Reserved keyword'
				]);
      }
			parsedDefinition.methods[methodName] = method;
		});
	}
};

export default onParseDefinition;