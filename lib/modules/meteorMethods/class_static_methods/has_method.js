import _ from 'lodash';

function hasMethod(methodName) {
	return _.has(this.schema.meteorMethods, methodName);
};

export default hasMethod;