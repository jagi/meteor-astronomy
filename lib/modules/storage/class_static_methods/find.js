import Event from '../../events/event.js';

function createMethod(methodName) {
  return function(selector, options) {
    let Class = this;
    let Collection = Class.getCollection();

    // Get selector and options from the arguments.
    selector = Mongo.Collection._rewriteSelector(selector || {});
    options = options || {};

    // Modify selector and options using the "beforeFind" event handlers.
    if (!options.disableEvents) {
      Class.dispatchEvent(new Event('beforeFind', {
        selector,
        options
      }));
    }

    // If it's an inherited class, then get only documents being instances of
    // the subclass.
    let typeField = Class.getTypeField();
    if (typeField) {
      selector[typeField] = Class.getName();
    }

    // Get default transform function if none is provided.
    if (options.transform === undefined) {
      options.transform = Class.getTransform();
    }

    // Execute the original method.
    let result = Collection[methodName](selector, options);

    // Modify a query result using the "afterFind" event handlers.
    if (!options.disableEvents) {
      Class.dispatchEvent(new Event('afterFind', {
        selector,
        options,
        result
      }));
    }

    return result;
  };
};

const find = createMethod('find');
const findOne = createMethod('findOne');

export { find, findOne };