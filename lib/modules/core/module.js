import Module from '../../core/module.js';
// Utils.
import cloneDefinition from './utils/cloneDefinition';
import deprecated from './utils/deprecated.js';
import overrideMethod from './utils/override_method.js';
import throwParseError from './utils/throw_parse_error.js';
import warn from './utils/warn.js';

Module.create({
  name: 'core',
  utils: {
    cloneDefinition,
    deprecated,
    overrideMethod,
    throwParseError,
    warn
  }
});