import {
	has
} from 'lodash';

function hasMethod(methodName) {
	return has(this.schema.meteorMethods, methodName);
};

export default hasMethod;