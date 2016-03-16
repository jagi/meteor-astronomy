import cloneDefinition from './utils/clone_definition.js';
import overrideMethod from './utils/override_method.js';
import throwParseError from './utils/throw_parse_error.js';
import warn from './utils/warn.js';
import wrapCallback from './utils/wrap_callback.js';
import hasMeteorMethod from './utils/has_meteor_method.js';
import removeUndefined from './utils/remove_undefined.js';

const Utils = {
    core: {
        cloneDefinition: cloneDefinition,
        overrideMethod: overrideMethod,
        throwParseError: throwParseError,
        warn: warn,
        wrapCallback: wrapCallback,
        hasMeteorMethod: hasMeteorMethod,
        removeUndefined: removeUndefined
    }
};

export default Utils;