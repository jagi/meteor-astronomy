import throwParseError from '../../../core/utils/throw_parse_error.js';

function onParseDefinition(parsedDefinition, definition, className) {
	// Check existence and validity of the "events" property.
	if (definition.events !== undefined) {
		_.each(definition.events, function(eventHandlers, eventName) {
			eventName = eventName.toLowerCase();
			// Check if the event definition is an array of functions.
			if (!Match.test(eventHandlers, Match.OneOf(Function, [Function]))) {
				throwParseError([{
						'class': className
					}, {
						'event': eventName
					},
					'Event handler has to be a function or an array of functions'
				]);
			}
			// Convert function to array of functions.
			if (Match.test(eventHandlers, Function)) {
				eventHandlers = [eventHandlers];
			}
			parsedDefinition.events[eventName] = eventHandlers;
		});
	}
};

export default onParseDefinition;