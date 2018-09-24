import _fromPairs from 'lodash/fromPairs';
import _map from 'lodash/map';
import config from '../../../core/config.js';
import getChildClass from './getChildClass';

function resolveValues(args = {}) {
  const {
    Class,
    rawDoc
  } = args;

  // We can not resolve when dealing with non object value or the "resolving"
  // config param is turned off.
  if (!rawDoc || !config.resolving) {
    return rawDoc;
  }

  // When resolving values, we need to get resolve method for a child class
  // if a given document is actually an instance of child class.
  const ChildClass = getChildClass({
    Class,
    rawDoc
  });

  // Construct resolved document from key-value pairs.
  return _fromPairs(
    _map(ChildClass.getFields(), (field) => {
      return [
        field.name,
        field.resolveValue(rawDoc)
      ];
    })
  );
}

export default resolveValues;