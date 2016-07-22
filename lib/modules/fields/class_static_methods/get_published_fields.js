import _ from 'lodash';

function getPublishedFields() {
    var publicFields = {};
    _.values(this.schema.fields).forEach((field) => {
        if (!field.private)
            publicFields[field.name] = 1;
    });
    return publicFields;
};

export default getPublishedFields;