import throwParseError from '../../../core/utils/throw_parse_error.js';
import Type from '../type.js';
import AstroClass from '../../../core/class.js';
import ScalarField from '../scalar_field.js';
import ObjectField from '../object_field.js';
import ListField from '../list_field.js';

function checkTypeExistence(type, className, fieldName) {
  if (!type) {
    throwParseError([{
        'class': className
      }, {
        'property': 'fields'
      }, {
        'field': fieldDefinition.name
      },
      'Type does not exist'
    ]);
  }
}

function onApplyDefinition(Class, parsedDefinition, className) {
  _.each(parsedDefinition.fields, function(fieldDefinition, fieldName) {
    // Prepare field variable.
    let field;
    // List field.
    if (Match.test(fieldDefinition.type, Array)) {
      let type = Type.find(fieldDefinition.type[0]);
      checkTypeExistence(type, className, fieldDefinition.name);
      if (AstroClass.isParentOf(type.class)) {
        field = new ListField(
          _.extend({}, fieldDefinition, {
            type: type
          })
        );
      }
      else {
        field = new ListField(
          _.extend({}, fieldDefinition, {
            type: type
          })
        );
      }
    }
    // Scalar or object field.
    else {
      let type = Type.find(fieldDefinition.type);
      checkTypeExistence(type, className, fieldDefinition.name);
      if (AstroClass.isParentOf(type.class)) {
        field = new ObjectField(
          _.extend({}, fieldDefinition, {
            type: type
          })
        );
      }
      else {
        field = new ScalarField(
          _.extend({}, fieldDefinition, {
            type: type
          })
        );
      }
    }

    // Add a field object to the fields list.
    Class.schema.fields[fieldName] = field;
    Class.schema.fieldsNames.push(fieldName);
  });
}

export default onApplyDefinition;