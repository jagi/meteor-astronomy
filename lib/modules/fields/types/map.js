import forEach from 'lodash/forEach';
import Type from '../type.js';
import Validators from '../../validators/validators.js';

Type.create({
  name: 'Map',
  class: Map,
  cast(object) {
    const map = new Map();
    forEach(object, (value, key) => {
      map.set(key, value);
    });
    return map;
  },
  validate(args) {
    // Validators.number(args);
  }
});
