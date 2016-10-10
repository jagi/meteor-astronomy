import _ from 'lodash';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_.each(sourceDefinition._meteorMethods, function(method, methodName) {
		targetDefinition._meteorMethods[methodName] = method;
	});
};

export default onMergeDefinitions;