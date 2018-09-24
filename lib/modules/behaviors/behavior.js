import _has from 'lodash/has';
import _extend from 'lodash/extend';
import throwParseError from '../core/utils/throw_parse_error.js';

const checkDefinition = function(definition) {
  // Check parameters validity.
  if (!Match.test(definition, Object)) {
    throwParseError([
      'Behavior definition has to be an object'
    ]);
  }

  // Check if behavior name is provided and is a string.
  if (!Match.test(definition.name, String)) {
    throwParseError([
      'Behavior has to be named'
    ]);
  }

  // Check if behavior with a given name already exists.
  if (_has(Behavior.behaviors, definition.name)) {
    throwParseError([{
        'behavior': definition.name
      },
      'Behavior already exists'
    ]);
  }
};

class Behavior {
  constructor(options) {
    this.options = _extend({}, this.options, options);
  }

  createClassDefinition() {}

  apply(Class) {
    let definition = this.createClassDefinition();
    if (definition) {
      Class.extend(definition);
    }
  }

  static create(definition) {
    checkDefinition(definition);

    // Get behavior name.
    let behaviorName = definition.name;
    // Extend the Behavior class.
    let Behavior = this.behaviors[behaviorName] = class Behavior extends this {};
    // Store definition in behavior class.
    Behavior.definition = definition;
    // Extend prototype with a definition.
    _extend(Behavior.prototype, definition);

    return Behavior;
  }

  static get(behaviorName) {
    return this.behaviors[behaviorName];
  }

  static has(behaviorName) {
    return _has(this.behaviors, behaviorName);
  }
};

Behavior.behaviors = {};

export default Behavior;