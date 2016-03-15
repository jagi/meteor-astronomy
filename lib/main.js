import './core/ejson.js';
import './modules/storage/module.js';
import './modules/behaviors/module.js';
import './modules/events/module.js';
import './modules/methods/module.js';
import './modules/fields/module.js';
import './modules/indexes/module.js';
import './modules/validators/module.js';

import Config from './core/config.js';
import Module from './core/module.js';
import Class from './core/class.js';
import Enum from './modules/fields/enum.js';
import Type from './modules/fields/type.js';
import Field from './modules/fields/field.js';
import ScalarField from './modules/fields/scalar_field.js';
import ObjectField from './modules/fields/object_field.js';
import ListField from './modules/fields/list_field.js';
import Behavior from './modules/behaviors/behavior.js';
import Validator from './modules/validators/validator.js';
import Validators from './modules/validators/validators.js';
import { ValidationError } from 'meteor/mdg:validation-error';
import Event from './modules/events/event.js';

const Astro = {
  Config,
  Module,
  Class,
  Enum,
  Type,
  Field,
  ScalarField,
  ObjectField,
  ListField,
  Behavior,
  Validator,
  Validators,
  ValidationError,
  Event
};

export {
  Astro,
  Module,
  Class,
  Enum,
  Type,
  Field,
  ScalarField,
  ObjectField,
  ListField,
  Behavior,
  Validator,
  Validators,
  ValidationError,
  Event
};