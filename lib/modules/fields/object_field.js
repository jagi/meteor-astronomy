import _ from 'lodash';
import Field from './field.js';
import { Class as AstroClass } from '../../core/class.js';
import Validators from '../validators/validators.js';

class ObjectField extends Field {
  validate(args) {
    super.validate(args);

    this.type.validate(args);
  }
};

export default ObjectField;