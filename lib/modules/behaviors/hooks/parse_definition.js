import throwParseError from '../../../core/utils/throw_parse_error.js';
import Behavior from '../behavior.js';

function onParseDefinition(parsedDefinition, definition, className) {
	// Check existence of the "behaviors" property.
	if (definition.behaviors !== undefined) {
		if (!Match.test(definition.behaviors, Match.OneOf([String], Object))) {
			throwParseError([{
					'class': className
				}, {
					'property': 'behaviors'
				},
				`Behaviors definition has to be an array of behaviors' names or an ` +
				`object with behaviors' options`
			]);
		}
		_.each(definition.behaviors, function(behaviorOptions, behaviorName) {
			// If we deal with an array of behaviors' names, then behavior options is
			// an empty object.
			if (_.isString(behaviorOptions)) {
				behaviorName = behaviorOptions;
				behaviorOptions = [{}];
			}
			// Check if behavior with a given name exists.
			if (!Behavior.has(behaviorName)) {
				throwParseError([{
						'class': className
					}, {
						'behavior': behaviorName
					},
					'Behavior does not exist'
				]);
			}
			// Behavior options has to be an object or an array of objects, when we
			// are adding multiple behaviors of the same type.
			if (!Match.test(behaviorOptions, Match.OneOf(Object, [Object]))) {
				throwParseError([{
						'class': className
					}, {
						'behavior': behaviorName
					},
					'Behavior options have to be an object or an array of objects'
				]);
			}
			// Make sure that behavior options is an array of objects.
			if (!Match.test(behaviorOptions, Array)) {
				behaviorOptions = [behaviorOptions];
			}
			parsedDefinition.behaviors[behaviorName] = behaviorOptions;
		});
	}
};

export default onParseDefinition;