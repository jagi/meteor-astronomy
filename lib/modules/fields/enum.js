import _ from 'lodash';
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
      identifiers = _.zipObject(
        definition.identifiers, _.range(definition.identifiers.length)
      );
    }
    else if (Match.test(definition.identifiers, Object)) {
      identifiers = definition.identifiers;
      let i = 0;
      _.each(identifiers, function(value, key) {
        if (_.isNil(value)) {
          identifiers[key] = i;
          i++;
        }
        else if (_.isNumber(value)) {
          i = value + 1;
        }
      });
    }
    const values = _.values(identifiers);
    const keys = _.keys(identifiers);
    // Create a new Enum constructor.
    const Enum = function Enum(identifier) {
      return Enum[identifier];
    };
    Enum.getIdentifiers = function() {
      return keys;
    };
    Enum.getIdentifier = function(value) {
      const index = _.indexOf(values, value);
      return keys[index];
    };
    // Set identifiers properties in the class.
    _.each(identifiers, (value, name) => {
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