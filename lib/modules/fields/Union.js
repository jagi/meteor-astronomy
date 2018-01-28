import _clone from 'lodash/clone';
import _some from 'lodash/some';
import Type from './type.js';
import Validators from '../validators/validators.js';
import { check, Match } from 'meteor/check';

const unionDefinitionPattern = {
  name: String,
  types: [Function],
  cast: Match.Optional(Function)
};

const Union = {
  create(definition) {
    check(definition, unionDefinitionPattern);

    // Create a new Union constructor.
    const Union = function Union(identifier) {
      return Union[identifier];
    };

    // Copy list of types to the union constructor.
    Union.types = _clone(definition.types);
    // Copy casting function to the union constructor if defined.
    if (typeof definition.cast === 'function') {
      Union.cast = definition.cast;
    }

    // Create type definition for the given enum.
    Type.create({
      name: definition.name,
      class: Union,
      cast(value) {
        return Union.cast ? Union.cast(value) : value;
      },
      validate(args) {
        const caughtErrors = [];
        // Check if a value will pass validation executed by any of the union
        // types.
        if (!_some(Union.types, (TypeClass) => {
          const AstroType = Type.find(TypeClass);
          try {
            AstroType.validate(args);
            return true;
          }
          catch (err) {
            caughtErrors.push(err);
            return false;
          }
        })) {
          throw caughtErrors[0];
        }
      }
    });
    // Store enum in the unions list.
    this.unions[definition.name] = Union;

    return Union;
  },
  unions: {}
};

export default Union;