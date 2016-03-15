import throwParseError from './utils/throw_parse_error.js';
import cloneDefinition from './utils/clone_definition.js';
import Module from './module.js';
import Event from '../modules/events/event.js';
import Type from '../modules/fields/type.js';
import Validators from '../modules/validators/validators.js';

let initClass = function(Class) {
	// Create and store the schema "definition" object in the class constructor.
	// It's a combination of all parent definitions and a definition that
	// created this class. It's used to create child classes.
	Class.definition = {};
	// Create and store the "schema" object in the class constructor. It's an
	// object that contains all the data related with a given class. The
	// "schema" object contains "computed" data of the schema "definition".
	// Thanks to that, Astronomy does not need to compute data on the fly and
	// everything works faster.
	Class.schema = {};

	// Init the class schema and schema definition.
	Module.forEach((module) => {
		module.onInitSchema(Class.schema, Class.getName());
		module.onInitDefinition(Class.definition, Class.getName());
	});
	// We have to call the "onInitClass" hooks in the separate loop after
	// initiation of the schema and schema definition, because some
	// "onInitClass" hooks can execute the "Class.extend" method which requires
	// schema and schama definition to be initalized.
	Module.forEach((module) => {
		module.onInitClass(Class, Class.getName());
	});
};

class Class {
	constructor(plainDoc) {
		let doc = this;
		let Class = doc.constructor;

		if (!Class.getName()) {
			throw new Error(
				'Can not create instance of the "Astro.Class" class'
			);
		}

		// Trigger the "beforeInit" event handlers.
		doc.dispatchEvent(new Event('beforeInit'));

		// Get all fields and try setting values for each field. If there is not
		// value for a field than use a default value. We also have to cast nested
		// values to the proper classes if provided. All of these operations are
		// done in the "resolveValue" method.
		plainDoc = plainDoc || {};
		let fields = Class.getFields();
		_.each(fields, (field) => {
			doc[field.name] = field.resolveValue(plainDoc);
		});

		// Trigger the "afterInit" event handlers.
		doc.dispatchEvent(new Event('afterInit'));
	}

	// Method needed for EJSONification.
	typeName() {
		return 'Astronomy';
	}

	toJSONValue(args) {
		let doc = this;
		let Class = doc.constructor;

		let json = {
			class: Class.getName()
		};

		// Trigger the "toJSONValue" event handlers.
		doc.dispatchEvent(new Event('toJSONValue', {
			json: json
		}));

		return json;
	}

	static getName() {
		return this.className;
	}

	static getParent() {
		if (this.parentClassName) {
			return this.get(this.parentClassName);
		}
	}

	static create(definition) {
		// Get class name.
		let className = definition.name;
		// Extend the Astro.Class class.
		let Class = this.classes[className] = class Class extends this {};
		// Store the class name in the constructor.
		Class.className = className;
		// Initialize class.
		initClass(Class);
		// Extend class with a definition.
		Class.extend(definition);
    // Register a new type.
    Type.create({
      name: className,
      class: Class,
      validate(args) {
        // Add current class as a param of validator.
        args.param = Class;
        Validators.class(args);
      }
    });

		return Class;
	}

	static inherit(definition) {
		let ParentClass = this;
		let className = definition.name;

		// Extend the parent class.
		let Class = this.classes[className] = class Class extends ParentClass {};

		// Store the class name in the constructor.
		Class.className = className;
		// Store the parent class name in the constructor.
		Class.parentClassName = ParentClass.getName();

		// Initialize class.
		initClass(Class);
		// Extend class with the parent class definition.
		Class.extend(ParentClass.definition);
		// Extend class with the definition.
		Class.extend(definition);

		return Class;
	}

	static extend(extendDefinition, onlyModules) {
		if (
			onlyModules !== undefined &&
			!Match.test(onlyModules, Match.OneOf(String, [String]))
		) {
			throwParseError([{
					'class': this.getName()
				}, {
					'method': 'extend'
				},
				'The second argument has to be a string or an array of strings'
			]);
		}

		if (Match.test(onlyModules, String)) {
			onlyModules = [onlyModules];
		}

		// Clone definition to not modify the original one.
		extendDefinition = cloneDefinition(extendDefinition);

		Module.forEach((module) => {
			// If the second argument was passed, then we only run module hooks for
			// modules that were listed in the second argument.
			if (onlyModules !== undefined && !_.includes(onlyModules, module.name)) {
				return;
			}
			// Initialize parsed definition.
			let parsedDefinition = {};
			module.onInitDefinition(parsedDefinition, Class.getName());
			// Parse the extending definition and put parsed properties in the parsed
			// definition.
			module.onParseDefinition(parsedDefinition, extendDefinition, this.getName());
			// Apply parsed definition.
			module.onApplyDefinition(this, parsedDefinition, this.getName());
			// Merge parsed definition with a class definition.
			module.onMergeDefinitions(this.definition, parsedDefinition, this.getName());
		});
	}

	static get(className) {
		return this.classes[className];
	}

	static has(className) {
		return _.has(this.classes, className);
	}

	static includes(Class) {
		return _.includes(this.classes, Class);
	}

	static isParentOf(Class) {
    if (!Class || !Class.prototype) {
      return false;
    }
		return this.prototype.isPrototypeOf(Class.prototype);
	}

  static isChildOf(Class) {
    if (!Class || !Class.prototype) {
      return false;
    }
    return Class.prototype.isPrototypeOf(this.prototype);
  }
};

Class.classes = {};

export default Class;