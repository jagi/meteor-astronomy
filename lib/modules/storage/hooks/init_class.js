import deprecated from '../../core/utils/deprecated';
// Class static methods.
import getCollection from '../class_static_methods/get_collection.js';
import getTypeField from '../class_static_methods/get_type_field.js';
import getTransform from '../class_static_methods/get_transform.js';
import isSecured from '../class_static_methods/is_secured.js';

function onInitClass(Class, className) {
  // Class static methods.
  Class.getCollection = getCollection;
  Class.getTypeField = getTypeField;
  Class.getTransform = getTransform;
  Class.isSecured = isSecured;

  if (Object.defineProperty && !Class.prototype.hasOwnProperty('_isNew')) {
    Object.defineProperty(Class.prototype, '_isNew', {
      enumerable: false,
      get() {
        deprecated(
          `Usage of the "_isNew" property have been deprecated. Please use ` +
          `the "${Class.getName()}.isNew(doc)" function.`
        )
        return Class.isNew(this);
      }
    });
  }
};

export default onInitClass;