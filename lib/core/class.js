import _concat from "lodash/concat";
import _defaults from "lodash/defaults";
import _each from "lodash/each";
import _has from "lodash/has";
import _includes from "lodash/includes";
import _intersection from "lodash/intersection";
import _isNumber from "lodash/isNumber";
import config from "./config";
import throwParseError from "../modules/core/utils/throw_parse_error";
import cloneDefinition from "../modules/core/utils/cloneDefinition";
import Module from "./module";
import Event from "../modules/events/event";
import Type from "../modules/fields/type";
import Validators from "../modules/validators/validators";
import warn from "../modules/core/utils/warn";

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
  // Create empty array for storing child classes.
  Class.children = [];
  // Init the class schema and schema definition.
  Module.forEach(module => {
    module.onInitSchema(Class.schema, Class.getName());
    module.onInitDefinition(Class.definition, Class.getName());
  });
  // We have to call the "onInitClass" hooks in the separate loop after
  // initiation of the schema and schema definition, because some
  // "onInitClass" hooks can execute the "Class.extend" method which requires
  // schema and schama definition to be initalized.
  Module.forEach(module => {
    module.onInitClass(Class, Class.getName());
  });
};

class Class {
  constructor(rawDoc = {}, options = {}) {
    // Set default options.
    _defaults(options, {
      // From version 2.3.0, we can turn off setting default values on fetching
      // so it will not populate fields that were excluded on find.
      defaults: config.defaults,
      // We clone values on document construction, but this option is overridden
      // in the "find" method and set to false, so it does not unnecessary clone
      // clone raw values.
      clone: true,
      cast: false
    });

    const doc = this;
    const Class = doc.constructor;

    if (!Class.getName()) {
      throw new Error('Can not create instance of the "Class" class');
    }

    // If there is the "_isNew" property passed to the class constructor, the
    // we use it to determine if a document is stored in collection. Otherwise
    // document is a new one.
    if (Class.getCollection()) {
      doc._isNew = _has(rawDoc, "_isNew") ? rawDoc._isNew : true;
    }

    // Trigger the "beforeInit" event handlers.
    doc.dispatchEvent(new Event("beforeInit"));

    // Set values in a document.
    _each(Class.getFieldsNames(), fieldName => {
      doc.set(fieldName, rawDoc[fieldName], options);
    });

    // Trigger the "afterInit" event handlers.
    doc.dispatchEvent(new Event("afterInit"));
  }

  // Method needed for EJSONification.
  typeName() {
    return "Astronomy";
  }

  toJSONValue(args) {
    let doc = this;
    let Class = doc.constructor;

    let json = {
      class: Class.getName()
    };

    // Trigger the "toJSONValue" event handlers.
    doc.dispatchEvent(
      new Event("toJSONValue", {
        json: json
      })
    );

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

  /**
   * @param {(Number|Boolean)} depth - The depth to which look for children, or "true" to get all children.
   */
  static getChildren(depth = 1) {
    const classes = [];
    if (!depth) {
      return classes;
    }
    classes.push(...this.children);
    if (_isNumber(depth)) {
      depth--;
    }
    _each(this.children, Child => {
      classes.push(...Child.getChildren(depth));
    });
    return classes;
  }

  static create(definition) {
    // Get class name.
    let className = definition.name;
    // Warn about class duplicate.
    if (_has(this.classes, className) && config.logs.classDuplicate) {
      warn(`Duplicate of the "${className}" class`);
    }
    // Extend the Class class.
    let Class = (this.classes[className] = class Class extends this {});
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
    const Parent = this;
    const className = definition.name;
    // Warn about class duplicate.
    if (_has(this.classes, className) && config.logs.classDuplicate) {
      warn(`Duplicate of the "${className}" class`);
    }
    // Extend the parent class.
    const Class = (this.classes[className] = class Class extends Parent {});
    // Store the class name in the constructor.
    Class.className = className;
    // Store the parent class name in the constructor.
    Class.parentClassName = Parent.getName();
    // Initialize class.
    initClass(Class);
    // Store child class in the parent class.
    Parent.children.push(Class);
    // Extend class with the parent class definition.
    Class.extend(Parent.definition);
    // Extend class with the definition.
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

  static extend(extendDefinition, onlyModules = []) {
    if (typeof onlyModules === "string") {
      onlyModules = [onlyModules];
    }

    if (!Match.test(onlyModules, [String])) {
      throwParseError([
        {
          class: this.getName()
        },
        {
          method: "extend"
        },
        "The second argument has to be a string or an array of strings"
      ]);
    }

    // Clone definition to not modify the original one.
    extendDefinition = cloneDefinition(extendDefinition);

    Module.forEach(module => {
      // If the second argument was passed, then we only run module hooks for
      // modules that were listed in the second argument.
      if (
        onlyModules.length > 0 &&
        !_includes(onlyModules, module.name) &&
        _intersection(onlyModules, module.aliases).length === 0
      ) {
        return;
      }
      // Initialize parsed definition.
      let parsedDefinition = {};
      module.onInitDefinition(parsedDefinition, Class.getName());
      // Parse the extending definition and put parsed properties in the parsed
      // definition.
      module.onParseDefinition(
        parsedDefinition,
        extendDefinition,
        this.getName()
      );
      // Apply parsed definition.
      module.onApplyDefinition(this, parsedDefinition, this.getName());
      // Merge parsed definition with a class definition.
      module.onMergeDefinitions(
        this.definition,
        parsedDefinition,
        this.getName()
      );
      // Finalize class creation.
      module.onFinalizeClass(this, this.getName());
    });

    // Extend children.
    const children = this.getChildren();
    _each(children, ChildClass => {
      ChildClass.extend(extendDefinition, onlyModules);
    });
  }

  static get(className) {
    return this.classes[className];
  }

  static has(className) {
    return _has(this.classes, className);
  }

  static includes(Class) {
    return _includes(this.classes, Class);
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

  static isNew(doc, isNew) {
    if (arguments.length === 2) {
      doc._isNew = isNew;
    } else {
      return doc._isNew;
    }
  }
}

Class.classes = {};

export default Class;
