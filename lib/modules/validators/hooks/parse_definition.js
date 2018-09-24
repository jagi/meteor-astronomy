import _each from 'lodash/each';
import _has from 'lodash/has';
import throwParseError from '../../core/utils/throw_parse_error.js';
import parseValidators from '../utils/parse_validators.js';

function onParseDefinition(parsedDefinition, definition, className) {
	if (definition.resolveError) {
		if (!Match.test(definition.resolveError, Function)) {
			throwParseError([{
					'class': className
				}, {
					'property': 'resolveError'
				},
				'Property values has to be a function'
			]);
		}

		parsedDefinition.resolveError = definition.resolveError;
	}

	if (definition.fields) {
		_each(definition.fields, function(fieldDefinition, fieldName) {
			if (_has(fieldDefinition, 'validators')) {
				parseValidators(
					fieldDefinition.validators, [{
						'class': className
					}, {
						'property': 'fields'
					}, {
						'field': fieldName
					}, {
						'property': 'validators'
					}]
				);

				parsedDefinition.validators[fieldName] = fieldDefinition.validators;
				fieldDefinition.validators = undefined;
			}
		});
	}

	if (definition.validators) {
		_each(definition.validators, function(validators, fieldName) {
			parseValidators(
				validators, [{
					'class': className
				}, {
					'property': 'validators'
				}]
			);

			parsedDefinition.validators[fieldName] = validators;
		});
	}
};

export default onParseDefinition;