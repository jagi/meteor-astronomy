import _ from 'lodash';
// Utils.
import resolveValues from '../../fields/utils/resolve_values.js';
import hasMeteorMethod from '../utils/has_meteor_method.js';
// Class static methods.
import { find, findOne } from '../class_static_methods/find.js';
import insert from '../class_static_methods/insert.js';
import update from '../class_static_methods/update.js';
import upsert from '../class_static_methods/upsert.js';
import remove from '../class_static_methods/remove.js';
// Class prototype methods.
import protoSave from '../class_prototype_methods/save.js';
import protoRemove from '../class_prototype_methods/remove.js';
import protoReload from '../class_prototype_methods/reload.js';
import protoCopy from '../class_prototype_methods/copy.js';
import protoGetModifier from '../class_prototype_methods/get_modifier.js';
import protoGetModified from '../class_prototype_methods/get_modified.js';
import protoGetModifiedValues from '../class_prototype_methods/get_modified_values.js';
import protoIsModified from '../class_prototype_methods/is_modified.js';
// Meteor methods.
import meteorInsert from '../meteor_methods/insert.js';
import meteorUpdate from '../meteor_methods/update.js';
import meteorUpsert from '../meteor_methods/upsert.js';
import meteorRemove from '../meteor_methods/remove.js';
// Class events.
import beforeInit from '../class_events/before_init.js';
import afterInit from '../class_events/after_init.js';
import fromJSONValue from '../class_events/from_json_value.js';
import toJSONValue from '../class_events/to_json_value.js';

function onApplyDefinition(Class, parsedDefinition, className) {
  const schema = Class.schema;

  if (parsedDefinition.collection) {
    const Collection = schema.collection = parsedDefinition.collection;
    const id = Collection._makeNewID();

    Class.extend({
      // Add the "_id" field.
      fields: {
        _id: {
          name: '_id',
          type: id.constructor,
          optional: true
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
    const connection = Collection._connection;
    if (connection) {
      // Prepare meteor methods to be added.
      const meteorMethods = {
        '/Astronomy/insert': meteorInsert,
        '/Astronomy/update': meteorUpdate,
        '/Astronomy/upsert': meteorUpsert,
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
    Class.upsert = upsert;
    Class.remove = remove;
    // Class prototype methods.
    Class.prototype.save = protoSave;
    Class.prototype.remove = protoRemove;
    Class.prototype.reload = protoReload;
    Class.prototype.copy = protoCopy;
    Class.prototype.getModifier = protoGetModifier;
    Class.prototype.getModified = protoGetModified;
    Class.prototype.getModifiedValues = protoGetModifiedValues;
    Class.prototype.isModified = protoIsModified;
  }

  // Apply type field.
  if (parsedDefinition.typeField) {
    const typeField = schema.typeField = parsedDefinition.typeField;
    Class.extend({
      // Add the type field.
      fields: {
        [typeField]: {
          type: String
        }
      },
      events: {
        afterInit: [afterInit]
      }
    }, ['fields', 'events']);

    if (parsedDefinition.typeField) {
      schema.typeField = parsedDefinition.typeField;
    }
  }

  // If class has already assigned collection.
  const Collection = Class.getCollection();
  if (Collection) {
    // Apply custom transformation function if the transform property is a
    // function.
    if (_.isFunction(parsedDefinition.transform)) {
      schema.transform = function(rawDoc) {
        const resolvedDoc = resolveValues({
          Class,
          values: rawDoc
        });
        return parsedDefinition.transform(resolvedDoc);
      };
    }
    else if (parsedDefinition.transform === null) {
      schema.transform = null;
    }

    if (parsedDefinition.secured !== undefined) {
      _.extend(schema.secured, parsedDefinition.secured);
    }
  }
};

export default onApplyDefinition;