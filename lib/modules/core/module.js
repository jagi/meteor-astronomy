import Module from '../../core/module.js';
// Utils.
import cloneDefinition from './utils/clone_definition.js';
import hasMeteorMethod from './utils/has_meteor_method.js';
import isEnvironment from './utils/is_environment.js';
import overrideMethod from './utils/override_method.js';
import throwParseError from './utils/throw_parse_error.js';
import warn from './utils/warn.js';
import wrapCallback from './utils/wrap_callback.js';

Module.create({
  name: 'core',
  utils: {
    cloneDefinition,
    hasMeteorMethod,
    isEnvironment,
    overrideMethod,
    throwParseError,
    warn,
    wrapCallback
  }
});