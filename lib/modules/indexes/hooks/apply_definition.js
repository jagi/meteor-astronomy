import _concat from 'lodash/concat';
import _each from 'lodash/each';
import _extend from 'lodash/extend';
import _includes from 'lodash/includes';
import _mapKeys from 'lodash/mapKeys';

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
    _each(indexes, (index, indexName) => {
      index.fields = _mapKeys(index.fields, (value, key) => {
        return `${fieldName}.${key}`;
      });
      _extend(index.options, {
        name: `${fieldName}.${indexName}`
      });
    });
    // Prefix object keys.
    indexes = _mapKeys(indexes, (index, indexName) => {
      return `${fieldName}.${indexName}`;
    });
    return indexes;
  }

  // Add indexes to the collection from nested classes.
  const checkedClasses = [];
  function collectNestedIndexes(Class) {
    // Stop checking if a given class was already checked.
    if (_includes(checkedClasses, Class)) {
      return;
    }
    checkedClasses.push(Class);
    const indexes = {};
    const fields = _concat(
      Class.getObjectFields(), Class.getListFields(true)
    );
    _each(fields, (field) => {
      _extend(
        indexes,
        prefixIndexes(field.type.class.definition.indexes, field.name),
        prefixIndexes(collectNestedIndexes(field.type.class), field.name)
      );
    });
    return indexes;
  }

  const indexes = _extend(
    {},
    parsedDefinition.indexes,
    collectNestedIndexes(Class)
  );

  _each(indexes, (index, indexName) => {
    schema.indexes[indexName] = index;
    Collection._ensureIndex(index.fields, index.options);
  });
};

export default onApplyDefinition;