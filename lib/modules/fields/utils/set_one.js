import _isObject from "lodash/isObject";
import { EJSON } from "meteor/ejson";
import traverse from "../utils/traverse";
import warn from "../../core/utils/warn";
import ObjectField from "../ObjectField";
import ListField from "../ListField";
import config from "../../../core/config";

function setOne(doc, fieldPattern, fieldValue, options) {
  // If the "clone" option was set and the value being set is an object,
  // then we clone value using the "EJSON.clone" function.
  if (options.clone && _isObject(fieldValue)) {
    fieldValue = EJSON.clone(fieldValue);
  }

  return traverse(doc, fieldPattern, (nestedDoc, nestedFieldName, field) => {
    // If a field does not exist than we don't return anything.
    if (!field) {
      const Class = doc.constructor;
      const className = Class.getName();
      config.logs.nonExistingField &&
        warn(
          `["${className}" class]["${fieldPattern}" field] ` +
            "Trying to set a value of the field that does not exist in the class"
        );
      return;
    }

    // Cast value if the "cast" option was set or if a field is instance of
    // ObjectField or ListField.
    if (
      options.cast ||
      field instanceof ObjectField ||
      (field instanceof ListField && field.isClass)
    ) {
      // If the "cast" option is set and we're casting array's element.
      if (
        options.cast &&
        field instanceof ListField &&
        /\d+/.test(nestedFieldName)
      ) {
        options.element = true;
      }
      fieldValue = field.castValue(fieldValue, options);
    }

    // Set default value if the "defualts" option was set.
    if (fieldValue === undefined && options.defaults) {
      fieldValue = field.getDefault(nestedDoc);
    }

    // Finally set casted/cloned/untouched value.
    nestedDoc[nestedFieldName] = fieldValue;
  });
}

export default setOne;
