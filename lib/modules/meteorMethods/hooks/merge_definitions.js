import _ from 'lodash';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_.each(sourceDefinition.meteorMethods, function(method, methodName) {
		targetDefinition.meteorMethods[methodName] = method;
	});
};

export default onMergeDefinitions;