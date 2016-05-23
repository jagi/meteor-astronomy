import Class from '../../../core/class.js';
import setDefaults from '../../fields/utils/set_defaults.js';

function getTransform(options) {
  return this.schema.transform;
};

export default getTransform;