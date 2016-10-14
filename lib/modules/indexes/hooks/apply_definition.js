import {
  concat,
  each,
  extend,
  includes,
  mapKeys
} from 'lodash';

function onApplyDefinition(Class, parsedDefinition, className) {
  const Collection = Class.getCollection();

  if (
    !Meteor.isServer ||
    !Collection ||
    (Collection && !Collection._connection)
  ) {
    return;
  }

  const schema = Class.schema;

  function prefixIndexes(indexes, fieldName) {
    // Prefix the fields property.
    each(indexes, (index, indexName) => {
      index.fields = mapKeys(index.fields, (value, key) => {
        return `${fieldName}.${key}`;
      });
      extend(index.options, {
        name: `${fieldName}.${indexName}`
      });
    });
    // Prefix object keys.
    indexes = mapKeys(indexes, (index, indexName) => {
      return `${fieldName}.${indexName}`;
    });
    return indexes;
  }

  // Add indexes to the collection from nested classes.
  const checkedClasses = [];
  function collectNestedIndexes(Class) {
    // Stop checking if a given class was already checked.
    if (includes(checkedClasses, Class)) {
      return;
    }
    checkedClasses.push(Class);
    const indexes = {};
    const fields = concat(
      Class.getObjectFields(), Class.getListFields(true)
    );
    each(fields, (field) => {
      extend(
        indexes,
        prefixIndexes(field.type.class.definition.indexes, field.name),
        prefixIndexes(collectNestedIndexes(field.type.class), field.name)
      );
    });
    return indexes;
  }

  const indexes = extend(
    {},
    parsedDefinition.indexes,
    collectNestedIndexes(Class)
  );

  each(indexes, (index, indexName) => {
    schema.indexes[indexName] = index;
    Collection._ensureIndex(index.fields, index.options);
  });
};

export default onApplyDefinition;