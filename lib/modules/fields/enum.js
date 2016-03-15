import Type from './type.js';
import Validators from '../validators/validators.js';

const enumDefinitionPattern = {
  name: String,
  options: Object
};

const Enum = {
  create(definition) {
    check(definition, enumDefinitionPattern);

    // Get options.
    const options = definition.options;
    const values = _.values(options);
    // Create a new Enum constructor.
    const Enum = function Enum(identifier) {
      return Enum[identifier];
    };
    // Set options properties in the class.
    _.each(options, (value, name) => {
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