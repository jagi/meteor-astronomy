import zipObject from 'lodash/zipObject';
import range from 'lodash/range';
import forOwn from 'lodash/forOwn';
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';
import values from 'lodash/values';
import keys from 'lodash/keys';
import indexOf from 'lodash/indexOf';
import each from 'lodash/each';
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
      identifiers = zipObject(
        definition.identifiers, range(definition.identifiers.length)
      );
    }
    else if (Match.test(definition.identifiers, Object)) {
      identifiers = definition.identifiers;
      let i = 0;
      forOwn(identifiers, function(value, key) {
        if (isNil(value)) {
          identifiers[key] = i;
          i++;
        }
        else if (isNumber(value)) {
          i = value + 1;
        }
      });
    }
    const values = values(identifiers);
    const keys = keys(identifiers);
    // Create a new Enum constructor.
    const Enum = function Enum(identifier) {
      return Enum[identifier];
    };
    Enum.getIdentifiers = function() {
      return keys;
    };
    Enum.getIdentifier = function(value) {
      const index = indexOf(values, value);
      return keys[index];
    };
    // Set identifiers properties in the class.
    each(identifiers, (value, name) => {
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