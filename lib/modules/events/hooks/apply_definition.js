function onApplyDefinition(Class, parsedDefinition, className) {
	let schema = Class.schema;

	// Add events to the event manager.
	_.each(parsedDefinition.events, function(eventHandlers, eventName) {
		eventName = eventName.toLowerCase();
		_.each(eventHandlers, function(eventHandler) {
			schema.events[eventName] = schema.events[eventName] || [];
			schema.events[eventName].push(eventHandler);
		});
	});
};

export default onApplyDefinition;