import Module from '../../core/module.js';
// Utils.
import cloneDefinition from './utils/clone_definition.js';
import isEnvironment from './utils/is_environment.js';
import overrideMethod from './utils/override_method.js';
import throwParseError from './utils/throw_parse_error.js';
import warn from './utils/warn.js';

Module.create({
  name: 'core',
  utils: {
    cloneDefinition,
    isEnvironment,
    overrideMethod,
    throwParseError,
    warn
  }
});