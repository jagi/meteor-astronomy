import {
	has
} from 'lodash';

function hasMethod(methodName) {
	return has(this.schema.methods, methodName);
};

export default hasMethod;