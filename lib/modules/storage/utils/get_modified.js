import AstroClass from '../../../core/class.js';
import throwParseError from '../../../core/utils/throw_parse_error.js';
import rawAll from '../../fields/utils/raw_all.js';

function getModified(options = {}) {
  let {
    doc: newDoc,
    transient = false,
    immutable = false
  } = options;

  // Check if a document is an instance of the Astronomy class.
  if (!(newDoc instanceof AstroClass)) {
    throwParseError([{
        'module': 'storage'
      }, {
        'utility': 'getModified'
      }, {
        'argument': 'doc'
      },
      'Document has to be an instance of the Astronomy class'
    ]);
  }
  // Get class constructor from the document.
  let Class = newDoc.constructor;
  // Check if a document's class has associated collection.
  if (!Class.getCollection()) {
    throwParseError([{
        'module': 'storage'
      }, {
        'utility': 'getModified'
      }, {
        'argument': 'doc'
      },
      `Document's class does not have associated collection`
    ]);
  }
  // Get a document before modifications.
  let oldDoc = newDoc._isNew ? new Class() : Class.findOne(newDoc._id);
  // If there is no document before modifications that may mean that we are not
  // subscribed to the publication publishing given document or we modified the
  // _id of a document.
  if (!oldDoc) {
    throwParseError([{
        'module': 'storage'
      }, {
        'utility': 'getModified'
      },
      `Can not get a document before modifications. You are not subscribed ` +
      `to the publication publishing a "${Class.getName()}" document with ` +
      `the id "${newDoc._id}" or you have modified the "_id" field`
    ]);
  }

  let diff = function({
    newDoc,
    oldDoc,
    prefix = ''
  }) {
    let result = [];

    _.each(newDoc, function(newValue, fieldName) {
      let oldValue = oldDoc[fieldName];

      if (!EJSON.equals(oldValue, newValue)) {
        let nestedPrefix = (prefix && prefix + '.') + fieldName;
        result.push(nestedPrefix);

        // Compare two objects.
        if (_.isPlainObject(oldValue) && _.isPlainObject(newValue)) {

          result.push(...diff({
            oldDoc: oldValue,
            newDoc: newValue,
            prefix: nestedPrefix
          }));

        }
        // Compare two arrays.
        else if (_.isArray(oldValue) && _.isArray(newValue)) {

          let maxLength = Math.max(oldValue.length, newValue.length);
          _.each(_.range(maxLength), function(index) {
            let arrayPrefix = nestedPrefix + '.' + index;
            let oldElement = oldValue[index];
            let newElement = newValue[index];
            if (!EJSON.equals(oldElement, newElement)) {
              result.push(arrayPrefix);
              // If both array elements are object, then we perform diff between
              // them.
              if (_.isPlainObject(oldElement) && _.isPlainObject(
                  newElement)) {
                // Get a difference between elements.
                result.push(...diff({
                  oldDoc: oldElement,
                  newDoc: newElement,
                  prefix: arrayPrefix
                }));
              }
            }
          });

        }
      }
    });

    return result;
  };

  return diff({
    // Get raw data from the docs.
    oldDoc: rawAll(oldDoc, {
      transient,
      immutable
    }),
    newDoc: rawAll(newDoc, {
      transient,
      immutable
    })
  });
};

export default getModified;