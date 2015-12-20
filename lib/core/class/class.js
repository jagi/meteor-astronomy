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
  _.each(Astro.Module.modules, function(module, moduleName) {
    module.onInitSchema(Class.schema, Class.getName());
    module.onInitDefinition(Class.definition, Class.getName());
  });
  // We have to call the "onInitClass" hooks in the separate loop after
  // initiation of the schema and schema definition, because some
  // "onInitClass" hooks can execute the "Class.extend" method which requires
  // schema and schama definition to be initalized.
  _.each(Astro.Module.modules, function(module, moduleName) {
    module.onInitClass(Class, Class.getName());
  });
};

Astro.Class = class Class {
  constructor(values) {
    var doc = this;
    var Class = doc.constructor;

    if (!Class.getName()) {
      throw new Error(
        'Can not create instance of the "Astro.Class" class'
      );
    }

    values = values || {};

    // Trigger the "beforeInit" event handlers.
    doc.dispatchEvent(new Astro.Event('beforeInit', {
      values: values
    }));

    // Get all fields and try setting values for each field. If there is not
    // value for a field than use a default value. We also have to cast nested
    // values to the proper classes if provided.
    Astro.utils.fields.setAll(doc, values, {
      default: true
    });

    // Try casting nested values.
    Astro.utils.fields.castNested(doc);

    // Trigger the "afterInit" event handlers.
    doc.dispatchEvent(new Astro.Event('afterInit', {
      values: values
    }));
  }

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
    doc.dispatchEvent(new Astro.Event('toJSONValue', {
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
    let className = definition.name;

    // Extend the Class.
    let Class =
      this.classes[className] = class Class extends this {};
    // Store the class name in the constructor.
    Class.className = className;
    // Initialize class.
    initClass(Class);
    // Extend class with a definition.
    Class.extend(definition);

    return Class;
  }

  static inherit(definition) {
    let ParentClass = this;
    let className = definition.name;

    // Extend the parent class.
    let Class =
      this.classes[className] = class Class extends ParentClass {};

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

  static extend(extendDefinition) {
    let Class = this;

    _.each(Astro.Module.modules, function(module, moduleName) {
      let parsedDefinition = module.onParseDefinition(
        extendDefinition, Class.getName()
      );
      module.onApplyDefinition(
        Class, parsedDefinition, Class.getName()
      );
      module.onMergeDefinitions(
        Class.definition, parsedDefinition, Class.getName()
      );
    });
  }

  static get(className) {
    return this.classes[className];
  }
};