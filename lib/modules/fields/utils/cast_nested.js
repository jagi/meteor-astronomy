import _ from 'lodash';
import AstroClass from '../../../core/class.js';

function createDocument(Class, rawDoc, options) {
  // If a nested field has a type field, then we have to check if we are
  // casting to some of the nested classes.
  const typeField = Class.getTypeField();
  if (typeField) {
    const ChildClass = AstroClass.get(rawDoc[typeField]);
    if (ChildClass && ChildClass.isChildOf(Class)) {
      return new ChildClass(rawDoc);
    }
  }
  return new Class(rawDoc, options);
};

function castNested(args = {}) {
  const {
    doc,
    options
  } = args;
  _.defaults(options, {
    clone: true
  });
  const Class = doc.constructor;

  _.each(Class.getObjectFields(), (field) => {
    let value = doc[field.name];
    // If field value is empty then go to the next one.
    if (_.isNil(value)) {
      return;
    }
    let NestedClass = field.type.class;
    if (!(value instanceof NestedClass)) {
      if (!_.isPlainObject(value)) {
        return;
      }
      doc[field.name] = createDocument(NestedClass, value, options);
    }
  });

  _.each(Class.getListFields(), (field) => {
    let value = doc[field.name];
    // If field value is empty then go to the next one.
    if (!_.isArray(value) || !field.isClass) {
      return;
    }
    let NestedClass = field.type.class;
    _.each(value, (element, index) => {
      if (!(element instanceof NestedClass)) {
        if (!_.isPlainObject(element)) {
          return;
        }
        value[index] = createDocument(NestedClass, element, options);
      }
    });
  });
};

export default castNested;