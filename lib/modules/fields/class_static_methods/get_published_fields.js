import _ from 'lodash';
import ObjectField from '../object_field.js';
import ListField from '../list_field.js';

function getPublishedFields() {
    var publicFields = {};
    _.values(this.schema.fields).forEach((field) => {
            if (!field.private) {
                if (field instanceof ObjectField || (field instanceof ListField && field.isClass)) {
                    Object.keys(field.type.class.getPublishedFields()).forEach((nestedFieldName) => {
                        publicFields[field.name + "." + nestedFieldName] = 1
                    })
                } else
                    publicFields[field.name] = 1;
            }
        }
    )
    ;
    return publicFields;
}
;

export default getPublishedFields;