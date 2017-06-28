import _each from 'lodash/each';

function onMergeDefinitions(targetDefinition, sourceDefinition, ClassName) {
	_each(sourceDefinition.validators, function(validators, fieldName) {
		targetDefinition.validators[fieldName] =
			targetDefinition.validators[fieldName] || [];
		targetDefinition.validators[fieldName] =
			targetDefinition.validators[fieldName].concat(validators);
	});

	targetDefinition.resolveError = sourceDefinition.resolveError;
};

export default onMergeDefinitions;