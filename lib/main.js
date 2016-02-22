import './core/ejson.js';
import './modules/storage/module.js';
import './modules/behaviors/module.js';
import './modules/events/module.js';
import './modules/methods/module.js';
import './modules/fields/module.js';
import './modules/indexes/module.js';
import './modules/validators/module.js';

import Config from './core/config.js';
import Class from './core/class.js';
import Module from './core/module.js';
import Field from './modules/fields/field.js';
import ScalarField from './modules/fields/scalar_field.js';
import ObjectField from './modules/fields/object_field.js';
import ListField from './modules/fields/list_field.js';
import Behavior from './modules/behaviors/behavior.js';
import Validator from './modules/validators/validator.js';
import Validators from './modules/validators/validators.js';
import ValidationError from './modules/validators/validation_error.js';
import Event from './modules/events/event.js';
import EventTarget from './modules/events/event_target.js';

const Astro = {
	Config: Config,
	Class: Class,
	Module: Module,
	Field: Field,
	ScalarField: ScalarField,
	ObjectField: ObjectField,
	ListField: ListField,
	Behavior: Behavior,
	Validator: Validator,
	Validators: Validators,
	ValidationError: ValidationError,
	Event: Event,
	EventTarget: EventTarget
};

export {
	Astro,
	Class,
	Module,
	Behavior,
	Validator,
	Validators,
	ValidationError,
	Event,
	EventTarget
};