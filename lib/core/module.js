import _each from 'lodash/each';
import throwParseError from '../modules/core/utils/throw_parse_error.js';

class Module {
  constructor(definition) {
    if (!Match.test(definition, Object)) {
      throwParseError([
        'Module definition has to be an object'
      ]);
    }

    // Set module name.
    if (!Match.test(definition.name, String)) {
      throwParseError([
        'Module name has to be a string'
      ]);
    }
    this.name = definition.name;

    // Set module aliases.
    if (!Match.test(definition.aliases, Match.Maybe([String]))) {
      throwParseError([
        `Module aliases has to be an array of strings in the "${this.name}" module`
      ]);
    }
    this.aliases = definition.aliases;

    // Set module hooks.
    _each([
      'onInitSchema', 'onInitDefinition', 'onInitClass', 'onParseDefinition',
      'onApplyDefinition', 'onMergeDefinitions', 'onFinalizeClass'
    ], (hookName) => {
      if (definition[hookName] === undefined) {
        return;
      }
      if (!Match.test(definition[hookName], Function)) {
        throwParseError([{
            'module': this.name
          }, {
            'property': hookName
          },
          `The "${hookName}" hook has to be a function`
        ]);
      }
      this[hookName] = definition[hookName];
    });

    // Set module utils.
    if (definition.utils) {
      if (!Match.test(definition.utils, Object)) {
        throwParseError([{
            'module': this.name
          }, {
            'property': 'utils'
          },
          'Utilities definition has to be an object'
        ]);
      }
      this.utils = {};
      _each(definition.utils, (method, methodName) => {
        if (!Match.test(method, Function)) {
          throwParseError([{
              'module': this.name
            }, {
              'property': 'utils'
            }, {
              'method': methodName
            },
            'Utility has to be a function'
          ]);
        }
        this.utils[methodName] = method;
      });
    }
  }

  onInitSchema(schema, className) {}
  onInitDefinition(definition, className) {}

  onInitClass(Class, className) {}

  onParseDefinition(parsedDefinition, definition, className) {}
  onApplyDefinition(Class, definition, className) {}
  onMergeDefinitions(targetDefinition, sourceDefinition, className) {}

  onFinalizeClass(Class, className) {}

  static create(definition) {
    let module = new this(definition);
    this.modules[module.name] = module;
    this.modulesOrder.push(module.name);
    return module;
  }

  static get(moduleName) {
    return this.modules[moduleName];
  }

  static forEach(iteratee) {
    if (!Match.test(iteratee, Function)) {
      throwParseError([
        'The first argument of the "Module.forEach" method has to be a function'
      ]);
    }
    _each(this.modulesOrder, (moduleName) => {
      iteratee(this.modules[moduleName]);
    });
  }
};

Module.modules = {};
Module.modulesOrder = [];

export default Module;