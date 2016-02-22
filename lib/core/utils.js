import cloneDefinition from './utils/clone_definition.js';
import overrideMethod from './utils/override_method.js';
import throwParseError from './utils/throw_parse_error.js';
import warn from './utils/warn.js';
import wrapCallback from './utils/wrap_callback.js';
import hasMeteorMethod from './utils/has_meteor_method.js';

const Utils = {
	core: {
		cloneDefinition: cloneDefinition,
		overrideMethod: overrideMethod,
		throwParseError: throwParseError,
		warn: warn,
		wrapCallback: wrapCallback,
		hasMeteorMethod: hasMeteorMethod
	}
};

export default Utils;