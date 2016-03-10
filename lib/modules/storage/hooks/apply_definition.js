// Utils.
import hasMeteorMethod from '../../../core/utils/has_meteor_method.js';
import transformToClass from '../utils/transform_to_class.js';
// Class static methods.
import { find, findOne } from '../class_static_methods/find.js';
import insert from '../class_static_methods/insert.js';
import update from '../class_static_methods/update.js';
import remove from '../class_static_methods/remove.js';
// Class prototype methods.
import protoSave from '../class_prototype_methods/save.js';
import protoRemove from '../class_prototype_methods/remove.js';
import protoReload from '../class_prototype_methods/reload.js';
import protoCopy from '../class_prototype_methods/copy.js';
import protoGetModified from '../class_prototype_methods/get_modified.js';
import protoGetModifiedValues from '../class_prototype_methods/get_modified_values.js';
import protoIsModified from '../class_prototype_methods/is_modified.js';
// Meteor methods.
import meteorInsert from '../meteor_methods/insert.js';
import meteorUpdate from '../meteor_methods/update.js';
import meteorRemove from '../meteor_methods/remove.js';
// Class events.
import beforeInit from '../class_events/before_init.js';
import afterInit from '../class_events/after_init.js';
import fromJSONValue from '../class_events/from_json_value.js';
import toJSONValue from '../class_events/to_json_value.js';

function onApplyDefinition(Class, parsedDefinition, className) {
  let schema = Class.schema;

  if (parsedDefinition.collection && schema.collection === undefined) {
    let Collection = schema.collection = parsedDefinition.collection

    Class.extend({
      // Add the "_id" field.
      fields: {
        _id: {
          name: '_id',
          type: String,
          // Make a field required only on the server.
          optional: !Meteor.isServer
        }
      },
      // Add storage events.
      events: {
        beforeInit: [beforeInit],
        toJSONValue: [toJSONValue],
        fromJSONValue: [fromJSONValue]
      }
    }, ['fields', 'events']);

    // If it's a remote collection then we register methods on the connection
    // object of the collection.
    let connection = Collection._connection;
    if (connection) {
      // Prepare meteor methods to be added.
      let meteorMethods = {
        '/Astronomy/insert': meteorInsert,
        '/Astronomy/update': meteorUpdate,
        '/Astronomy/remove': meteorRemove,
      };
      _.each(meteorMethods, (meteorMethod, methodName) => {
        if (!hasMeteorMethod(connection, methodName)) {
          // Add meteor method.
          connection.methods(_.zipObject([methodName], [meteorMethod]));
        }
      });
    }

    // Class static methods.
    Class.find = find;
    Class.findOne = findOne;
    Class.insert = insert;
    Class.update = update;
    Class.remove = remove;
    // Class prototype methods.
    Class.prototype.save = protoSave;
    Class.prototype.remove = protoRemove;
    Class.prototype.reload = protoReload;
    Class.prototype.copy = protoCopy;
    Class.prototype.getModified = protoGetModified;
    Class.prototype.getModifiedValues = protoGetModifiedValues;
    Class.prototype.isModified = protoIsModified;
  }

  // If class has already assigned collection.
  let Collection = Class.getCollection();
  if (Collection) {
    if (parsedDefinition.typeField) {
      let typeField = schema.typeField = parsedDefinition.typeField;

      let fields = {};
      fields[typeField] = {
        name: typeField,
        type: String
      };
      Class.extend({
        // Add the type field.
        fields: fields,
        events: {
          afterInit: [afterInit]
        }
      }, ['fields', 'events']);
    }

    // Apply custom transformation function if the transform property is a
    // function.
    if (parsedDefinition.transform instanceof Function) {
      schema.transform = function(attrs) {
        return parsedDefinition.transform(attrs);
      };
    }
    // Apply default transform function if the transform property is undefined
    // and there was no transform function assigned before.
    else if (
      parsedDefinition.transform === undefined &&
      schema.transform === undefined
    ) {
      schema.transform = transformToClass(className);
    }
  }
};

export default onApplyDefinition;