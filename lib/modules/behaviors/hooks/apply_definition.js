import each from 'lodash/each';
import Behavior from '../behavior.js';

function onApplyDefinition(Class, parsedDefinition, className) {
  let schema = Class.schema;

  // Add behaviors to the class.
  each(parsedDefinition.behaviors, (behaviorsOptions, behaviorName) => {
    // Get the behavior class.
    let BehaviorClass = Behavior.get(behaviorName);
    each(behaviorsOptions, (behaviorOptions) => {
      // Create the behavior instance passing behavior options.
      let behavior = new BehaviorClass(behaviorOptions);
      // Add behavior to the schema.
      schema.behaviors[behaviorName] = schema.behaviors[behaviorName] || [];
      schema.behaviors[behaviorName].push(behavior);
      // Apply behavior to the class.
      behavior.apply(Class);
    });
  });
};

export default onApplyDefinition;