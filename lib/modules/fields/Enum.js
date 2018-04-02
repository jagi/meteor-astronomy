import _zipObject from 'lodash/zipObject';
import _range from 'lodash/range';
import _forOwn from 'lodash/forOwn';
import _isNil from 'lodash/isNil';
import _isNumber from 'lodash/isNumber';
import _values from 'lodash/values';
import _keys from 'lodash/keys';
import _indexOf from 'lodash/indexOf';
import _each from 'lodash/each';
import Type from './type.js';
import Validators from '../validators/validators.js';
import { check, Match } from 'meteor/check';

const enumDefinitionPattern = {
  name: String,
  identifiers: Match.OneOf(Array, Object)
};

const Enum = {
  create(definition) {
    check(definition, enumDefinitionPattern);

    // Get identifiers and values.
    let identifiers;
    if (Match.test(definition.identifiers, Array)) {
      identifiers = _zipObject(
        definition.identifiers, _range(definition.identifiers.length)
      );
    }
    else if (Match.test(definition.identifiers, Object)) {
      identifiers = definition.identifiers;
      let i = 0;
      _forOwn(identifiers, function(value, key) {
        if (_isNil(value)) {
          identifiers[key] = i;
          i++;
        }
        else if (_isNumber(value)) {
          i = value + 1;
        }
      });
    }
    const values = _values(identifiers);
    const keys = _keys(identifiers);
    // Create a new Enum constructor.
    const Enum = function Enum(identifier) {
      return Enum[identifier];
    };
    Enum.getValues = function() {
        return values;
    };
    Enum.getIdentifiers = function() {
      return keys;
    };
    Enum.getIdentifier = function(value) {
      const index = _indexOf(values, value);
      return keys[index];
    };
    // Set identifiers properties in the class.
    _each(identifiers, (value, name) => {
      if (Object.defineProperty) {
        Object.defineProperty(Enum, name, {
          writable: false,
          enumerable: true,
          value
        });
      }
      else {
        Enum[name] = value;
      }
    });
    // Create type definition for the given enum.
    Type.create({
      name: definition.name,
      class: Enum,
      validate(args) {
        args.param = values;
        Validators.choice(args);
      }
    });
    // Store enum in the enums list.
    this.enums[definition.name] = Enum;

    return Enum;
  },
  enums: {}
};

export default Enum;