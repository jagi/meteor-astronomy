import './core/ejson.js';
import './modules/core/module.js';
import './modules/storage/module.js';
import './modules/behaviors/module.js';
import './modules/events/module.js';
import './modules/methods/module.js';
import './modules/helpers/module.js';
import './modules/fields/module.js';
import './modules/indexes/module.js';
import './modules/validators/module.js';

import Config from './core/config.js';
import Module from './core/module.js';
import Class from './core/class.js';
import reservedKeywords from './core/reserved_keywords.js';
import Enum from './modules/fields/Enum.js';
import Union from './modules/fields/Union.js';
import Type from './modules/fields/type.js';
import Field from './modules/fields/Field';
import ScalarField from './modules/fields/ScalarField';
import ObjectField from './modules/fields/ObjectField';
import ListField from './modules/fields/ListField';
import Behavior from './modules/behaviors/behavior.js';
import Validator from './modules/validators/validator.js';
import Validators from './modules/validators/validators.js';
import { ValidationError } from 'meteor/mdg:validation-error';
import Event from './modules/events/event.js';

const Astro = {
  config: Config,
  Config,
  Module,
  Class,
  Enum,
  Union,
  Type,
  Field,
  ScalarField,
  ObjectField,
  ListField,
  Behavior,
  Validator,
  Validators,
  ValidationError,
  Event,
  reservedKeywords
};

export {
  Astro,
  Module,
  Class,
  Enum,
  Union,
  Type,
  Field,
  ScalarField,
  ObjectField,
  ListField,
  Behavior,
  Validator,
  Validators,
  ValidationError,
  Event,
  reservedKeywords
};