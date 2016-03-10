// Class static methods.
import getField from '../class_static_methods/get_field.js';
import getFieldsNames from '../class_static_methods/get_fields_names.js';
import getFields from '../class_static_methods/get_fields.js';
import getObjectFields from '../class_static_methods/get_object_fields.js';
import getListFields from '../class_static_methods/get_list_fields.js';
import hasField from '../class_static_methods/has_field.js';
// Class prototype methods.
import get from '../class_prototype_methods/get.js';
import raw from '../class_prototype_methods/raw.js';
import set from '../class_prototype_methods/set.js';
// Class events.
import fromJSONValue from '../class_events/from_json_value.js';
import toJSONValue from '../class_events/to_json_value.js';

function onInitClass(Class, className) {
  // Class static methods.
  Class.getField = getField;
  Class.getFieldsNames = getFieldsNames;
  Class.getFields = getFields;
  Class.getObjectFields = getObjectFields;
  Class.getListFields = getListFields;
  Class.hasField = hasField;
  // Class prototype methods.
  Class.prototype.get = get;
  Class.prototype.raw = raw;
  Class.prototype.set = set;
  // Class events.
  Class.extend({
    events: {
      fromJSONValue,
      toJSONValue
    }
  }, ['events']);
};

export default onInitClass;