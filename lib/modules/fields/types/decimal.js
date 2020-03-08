import Type from '../type.js';
import Validators from '../../validators/validators.js';
import { Decimal } from 'meteor/mongo-decimal';

Type.create({
  name: 'Decimal',
  class: Decimal,
  cast(value) {
    Decimal(value.toString())
  },
  validate(args) {
    Decimal.isDecimal(args)
  }
});
